"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface FollowupChipsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export default function FollowupChips({ suggestions, onSelect }: FollowupChipsProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 py-2">
      {suggestions.map((suggestion, i) => (
        <Button
          key={i}
          variant="outline"
          size="sm"
          className="text-xs h-auto py-1.5 px-3 rounded-full"
          onClick={() => onSelect(suggestion)}
        >
          <Sparkles className="h-3 w-3 mr-1" />
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
