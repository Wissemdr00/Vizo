"use client";

import { Badge } from "@/components/ui/badge";
import { Coins } from "lucide-react";
import useCredits from "@/lib/users/useCredits";
import Link from "next/link";

export default function CreditCounter() {
  const { credits, isLoading } = useCredits();
  const aiCredits = credits?.ai_query || 0;

  if (isLoading) return null;

  const isLow = aiCredits <= 5;

  return (
    <Link href="/app/credits" className="inline-flex">
      <Badge
        variant={isLow ? "destructive" : "secondary"}
        className="gap-1 cursor-pointer"
      >
        <Coins className="h-3 w-3" />
        {aiCredits} credits
      </Badge>
    </Link>
  );
}
