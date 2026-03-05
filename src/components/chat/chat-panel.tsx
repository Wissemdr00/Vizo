"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, StopCircle } from "lucide-react";
import MessageBubble from "./message-bubble";
import FollowupChips from "./followup-chips";
import ToolCallIndicator from "./tool-call-indicator";
import CreditCounter from "./credit-counter";
import { toast } from "sonner";
import type { UIMessage } from "@ai-sdk/react";

interface ChatPanelProps {
  conversationId: string;
  workspaceId: string;
  initialMessages?: { role: "user" | "assistant"; content: string }[];
}

export default function ChatPanel({
  conversationId,
  workspaceId,
  initialMessages = [],
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const [followups, setFollowups] = useState<string[]>([]);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/app/chat",
      body: { conversationId, workspaceId },
    }),
    messages: initialMessages.map((m, i) => ({
      id: String(i),
      role: m.role as "user" | "assistant",
      parts: [{ type: "text" as const, text: m.content }],
      metadata: {},
    })) as UIMessage[],
    onError: (err) => {
      toast.error(err.message || "Failed to get AI response");
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Extract followups from completed assistant messages
  useEffect(() => {
    if (status !== "ready") return;
    const last = messages[messages.length - 1];
    if (last?.role !== "assistant") return;
    for (const part of last.parts ?? []) {
      if (
        part.type === "tool-invocation" &&
        (part as { type: string; toolName?: string; state?: string; result?: { suggestions?: string[] } }).toolName === "suggest_followups" &&
        (part as { type: string; state?: string }).state === "result"
      ) {
        const result = (part as { result?: { suggestions?: string[] } }).result;
        if (result?.suggestions) setFollowups(result.suggestions);
      }
    }
  }, [status, messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput("");
    setFollowups([]);
    sendMessage({ text });
  };

  const handleFollowupSelect = (text: string) => {
    setFollowups([]);
    sendMessage({ text });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  // Helper: extract text content from a message
  const getMessageText = (msg: UIMessage) => {
    return (msg.parts ?? [])
      .filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="text-sm font-medium">Chat</h3>
        <CreditCounter />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p className="text-lg font-medium mb-1">Ask anything about your data</p>
            <p className="text-sm">Try: &quot;Show me the top 10 rows&quot; or &quot;What trends do you see?&quot;</p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role as "user" | "assistant"}
            content={getMessageText(message)}
            isStreaming={isLoading && message.id === messages[messages.length - 1]?.id && message.role === "assistant"}
          />
        ))}

        {/* Tool call indicators */}
        {isLoading && messages[messages.length - 1]?.role === "assistant" && (
          <ToolCallIndicator toolName="thinking" />
        )}

        {/* Follow-up suggestions */}

        {!isLoading && followups.length > 0 && (
          <FollowupChips suggestions={followups} onSelect={handleFollowupSelect} />
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your data..."
            className="min-h-[44px] max-h-[120px] resize-none"
            rows={1}
            disabled={isLoading}
          />
          {isLoading ? (
            <Button type="button" variant="outline" size="icon" onClick={stop}>
              <StopCircle className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" size="icon" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
