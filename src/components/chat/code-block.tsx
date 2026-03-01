"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Play, Pencil, X } from "lucide-react";
import { toast } from "sonner";

interface CodeBlockProps {
  code: string;
  language: "sql" | "python";
  onRerun?: (code: string) => void;
}

export default function CodeBlock({ code, language, onRerun }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(code);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };

  const handleRerun = () => {
    if (onRerun) {
      onRerun(editedCode);
      setEditing(false);
    }
  };

  return (
    <div className="rounded-lg border bg-zinc-950 text-zinc-100 overflow-hidden my-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800">
        <span className="text-xs font-mono text-zinc-400 uppercase">{language}</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white" onClick={handleCopy}>
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
          {onRerun && !editing && (
            <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white" onClick={() => setEditing(true)}>
              <Pencil className="h-3 w-3" />
            </Button>
          )}
          {editing && (
            <>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white" onClick={() => setEditing(false)}>
                <X className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-green-400 hover:text-green-300" onClick={handleRerun}>
                <Play className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Code */}
      {editing ? (
        <textarea
          value={editedCode}
          onChange={(e) => setEditedCode(e.target.value)}
          className="w-full bg-zinc-950 text-zinc-100 font-mono text-sm p-3 resize-y min-h-[80px] focus:outline-none"
          rows={editedCode.split("\n").length + 1}
        />
      ) : (
        <pre className="p-3 overflow-x-auto text-sm">
          <code className="font-mono">{code}</code>
        </pre>
      )}
    </div>
  );
}
