"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  MessageSquare,
  ArrowLeft,
  Trash2,
  PenLine,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ChatPanel from "@/components/chat/chat-panel";
import useConversations from "@/lib/conversations/useConversations";

export default function WorkspaceChatPage() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { conversations, isLoading, mutate } = useConversations(workspaceId);
  const [activeConvId, setActiveConvId] = useState<string | null>(
    searchParams.get("conv")
  );

  // Create new conversation
  const handleNewConversation = async () => {
    try {
      const res = await fetch("/api/app/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId }),
      });
      if (!res.ok) throw new Error("Failed to create conversation");
      const conv = await res.json();
      setActiveConvId(conv.id);
      mutate();
    } catch {
      toast.error("Failed to create conversation");
    }
  };

  // Delete conversation
  const handleDelete = async (convId: string) => {
    try {
      const res = await fetch(`/api/app/conversations/${convId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      if (activeConvId === convId) setActiveConvId(null);
      mutate();
      toast.success("Conversation deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Auto-select first conversation
  useEffect(() => {
    if (!activeConvId && conversations.length > 0 && !isLoading) {
      setActiveConvId(conversations[0].id);
    }
  }, [conversations, activeConvId, isLoading]);

  return (
    <div className="h-[calc(100vh-64px)]">
      <ResizablePanelGroup direction="horizontal">
        {/* Left: Conversation List */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          <div className="flex flex-col h-full border-r">
            <div className="flex items-center gap-2 p-3 border-b">
              <Button variant="ghost" size="icon" asChild className="shrink-0">
                <Link href="/app">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h2 className="text-sm font-semibold flex-1 truncate">Conversations</h2>
              <Button size="sm" variant="outline" onClick={handleNewConversation}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                New
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="space-y-2 p-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                  <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No conversations yet</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={handleNewConversation}
                  >
                    Start your first analysis
                  </Button>
                </div>
              ) : (
                <div className="space-y-0.5 p-2">
                  {conversations.map((conv: Record<string, unknown>) => (
                    <div
                      key={conv.id as string}
                      className={`group flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                        activeConvId === conv.id
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setActiveConvId(conv.id as string)}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 opacity-50" />
                      <span className="text-sm truncate flex-1">
                        {conv.title as string}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(conv.id as string);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right: Chat + Visualization */}
        <ResizablePanel defaultSize={75}>
          {activeConvId ? (
            <ChatPanel
              key={activeConvId}
              conversationId={activeConvId}
              workspaceId={workspaceId}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">Select or create a conversation</p>
                <p className="text-sm mt-1">Start analyzing your data with AI</p>
              </div>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
