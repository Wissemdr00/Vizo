"use client";

import { useChat } from "ai/react";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, StopCircle } from "lucide-react";
import MessageBubble from "./message-bubble";
import FollowupChips from "./followup-chips";
import ToolCallIndicator from "./tool-call-indicator";
import CreditCounter from "./credit-counter";
import { toast } from "sonner";

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
  const [followups, setFollowups] = useState<string[]>([]);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error,
    setInput,
  } = useChat({
    api: "/api/app/chat",
    body: { conversationId, workspaceId },
    initialMessages: initialMessages.map((m, i) => ({
      id: String(i),
      role: m.role,
      content: m.content,
    })),
    onError: (err) => {
      toast.error(err.message || "Failed to get AI response");
    },
    onToolCall: async ({ toolCall }) => {
      if (toolCall.toolName === "suggest_followups") {
        const result = toolCall.args as { suggestions?: string[] };
        if (result?.suggestions) {
          setFollowups(result.suggestions);
        }
      }
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFollowupSelect = (text: string) => {
    setInput(text);
    setFollowups([]);
    // Auto-submit
    setTimeout(() => {
      inputRef.current?.form?.requestSubmit();
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = inputRef.current?.form;
      if (form && input.trim()) {
        form.requestSubmit();
        setFollowups([]);
      }
    }
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
            content={message.content}
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

        {/* Error */}
        {error && (
          <div className="mx-4 my-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error.message}
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
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
