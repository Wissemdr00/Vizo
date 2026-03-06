import { streamText, convertToModelMessages } from "ai";
import type { UIMessage } from "@ai-sdk/react";
import { getAgentConfig } from "@/lib/ai/agent";
import { db } from "@/db";
import { conversations } from "@/db/schema/conversations";
import { messages } from "@/db/schema/messages";
import { dataSources } from "@/db/schema/data-sources";
import { workspaces } from "@/db/schema/workspaces";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { deductCredits, getUserCredits } from "@/lib/credits/recalculate";

export const maxDuration = 60;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();
  const { messages: chatMessages, conversationId, workspaceId } = body as {
    messages: UIMessage[];
    conversationId: string;
    workspaceId: string;
  };

  // Verify workspace ownership
  const [ws] = await db
    .select()
    .from(workspaces)
    .where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, userId)));
  if (!ws) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  // Check credits (FR-5.7)
  const credits = await getUserCredits(userId);
  const aiCredits = credits.ai_query || 0;
  if (aiCredits < 1) {
    return NextResponse.json(
      { error: "No AI query credits remaining. Purchase more to continue.", code: "CREDIT_EXHAUSTED" },
      { status: 403 }
    );
  }

  // Load data source schemas for context
  const sources = await db
    .select({
      id: dataSources.id,
      name: dataSources.name,
      type: dataSources.type,
      schema: dataSources.schema,
    })
    .from(dataSources)
    .where(eq(dataSources.workspaceId, workspaceId));

  const schemas = sources.map((s) => ({
    id: s.id,
    name: s.name,
    type: s.type,
    ...(s.schema as { columns?: { name: string; type: string }[]; tables?: { name: string; columns: { name: string; type: string }[]; estimatedRowCount: number }[] }),
  }));

  // Get agent config
  const config = getAgentConfig({
    provider: ws.aiProvider || "openai",
    schemas,
    workspaceName: ws.name,
  });

  // Save user message
  const lastUserMsg = chatMessages[chatMessages.length - 1];
  const lastUserText = lastUserMsg?.role === "user"
    ? (lastUserMsg.parts
        ?.filter((p) => p.type === "text")
        .map((p) => (p as { type: "text"; text: string }).text)
        .join("") ?? "")
    : "";

  if (lastUserMsg?.role === "user" && lastUserText) {
    await db.insert(messages).values({
      conversationId,
      role: "user",
      content: lastUserText,
    });

    // Auto-title from first message (FR-5.9)
    const [conv] = await db
      .select({ title: conversations.title })
      .from(conversations)
      .where(eq(conversations.id, conversationId));
    if (conv?.title === "New Analysis") {
      await db
        .update(conversations)
        .set({ title: lastUserText.slice(0, 50), updatedAt: new Date() })
        .where(eq(conversations.id, conversationId));
    }
  }

  // Deduct 1 ai_query credit (FR-5.6)
  await deductCredits(userId, "ai_query", 1, { conversationId });

  // Stream AI response
  const result = streamText({
    ...config,
    messages: await convertToModelMessages(chatMessages),
    onFinish: async ({ text }) => {
      // Save assistant message
      if (text) {
        await db.insert(messages).values({
          conversationId,
          role: "assistant",
          content: text,
        });
        // Update conversation timestamp
        await db
          .update(conversations)
          .set({ updatedAt: new Date() })
          .where(eq(conversations.id, conversationId));
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
