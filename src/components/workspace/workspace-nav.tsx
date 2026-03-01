"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { Database, MessageSquare, BarChart3, Settings } from "lucide-react";

const tabs = [
  { href: "sources", label: "Sources", icon: Database },
  { href: "chat", label: "Chat", icon: MessageSquare },
  { href: "gallery", label: "Gallery", icon: BarChart3 },
  { href: "settings", label: "Settings", icon: Settings },
];

export default function WorkspaceNav() {
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();

  return (
    <nav className="flex gap-1 border-b px-4">
      {tabs.map((tab) => {
        const href = `/app/workspace/${id}/${tab.href}`;
        const isActive = pathname.includes(tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={href}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
