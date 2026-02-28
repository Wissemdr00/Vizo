import { db } from "@/db";
import { workspaces } from "@/db/schema/workspaces";
import { eq } from "drizzle-orm";

/**
 * Ensures a user has at least one workspace.
 * If none exist, creates "My First Workspace" (FR-2.6).
 * Returns the workspace ID to use.
 */
export async function ensureWorkspace(userId: string): Promise<string> {
  const existing = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(eq(workspaces.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0].id;
  }

  const [created] = await db
    .insert(workspaces)
    .values({
      userId,
      name: "My First Workspace",
      description: "Auto-created on your first data upload",
    })
    .returning({ id: workspaces.id });

  return created.id;
}
