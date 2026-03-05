"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Settings, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function WorkspaceSettingsPage() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { data: workspace, mutate } = useSWR(`/api/app/workspaces/${workspaceId}`, fetcher);
  const [aiProvider, setAiProvider] = useState<string>("openai");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (workspace?.aiProvider) {
      setAiProvider(workspace.aiProvider);
    }
  }, [workspace]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/app/workspaces/${workspaceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiProvider }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Settings saved");
      mutate();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/app/workspace/${workspaceId}/sources`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Workspace Settings</h1>
          <p className="text-muted-foreground text-sm">
            Configure AI provider and workspace preferences
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            AI Provider
          </CardTitle>
          <CardDescription>
            Choose which AI model powers your data analysis conversations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={aiProvider} onValueChange={setAiProvider}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select AI provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI GPT-4o</SelectItem>
              <SelectItem value="anthropic">Anthropic Claude</SelectItem>
              <SelectItem value="openrouter">OpenRouter Arcee</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
