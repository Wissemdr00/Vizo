"use client";
import React, { useState } from "react";
import useCurrentPlan from "@/lib/users/useCurrentPlan";
import useUser from "@/lib/users/useUser";
import useWorkspaces from "@/lib/workspaces/useWorkspaces";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  DatabaseIcon,
  MessageSquareIcon,
  BarChart3Icon,
  SparklesIcon,
  Loader2,
  FolderIcon,
} from "lucide-react";
import Link from "next/link";
import useCredits from "@/lib/users/useCredits";
import WorkspaceCard from "@/components/workspaces/workspace-card";
import { toast } from "sonner";

function AppHomepage() {
  const { currentPlan, isLoading: planLoading } = useCurrentPlan();
  const { credits, isLoading: creditsLoading } = useCredits();
  const { user, isLoading: userLoading } = useUser();
  const { workspaces, isLoading: workspacesLoading, mutate } = useWorkspaces();

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const aiQueryCredits = (credits as Record<string, number> | null)?.ai_query ?? 0;

  const handleCreateWorkspace = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/app/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          description: newDescription.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create workspace");
      }
      toast.success("Workspace created");
      setCreateOpen(false);
      setNewName("");
      setNewDescription("");
      mutate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create workspace");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        {userLoading ? (
          <Skeleton className="h-9 w-64" />
        ) : (
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {firstName} 👋
          </h1>
        )}
        <p className="text-muted-foreground">
          Connect a data source and start asking questions to get instant insights.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>AI Query Credits</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              {creditsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5 text-yellow-500" />
                  {aiQueryCredits}
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="p-0 h-auto text-xs">
              <Link href="/app/credits">Buy more credits →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Plan</CardDescription>
            <CardTitle className="text-2xl">
              {planLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <Badge variant="secondary" className="text-sm px-2 py-1">
                  {currentPlan?.name ?? "Free"}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="p-0 h-auto text-xs">
              <Link href="/app/plan">Upgrade plan →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Workspaces</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              {workspacesLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <FolderIcon className="h-5 w-5 text-blue-500" />
                  {workspaces.length}
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="p-0 h-auto text-xs">
                  Create workspace →
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Workspace</DialogTitle>
                  <DialogDescription>
                    Organize your data sources and analyses in a workspace.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <div>
                    <Label htmlFor="ws-name">Name</Label>
                    <Input
                      id="ws-name"
                      placeholder="My Workspace"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreateWorkspace()}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ws-desc">Description (optional)</Label>
                    <Textarea
                      id="ws-desc"
                      placeholder="What's this workspace for?"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateWorkspace}
                    disabled={creating || !newName.trim()}
                  >
                    {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Workspaces */}
      {workspacesLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : workspaces.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FolderIcon className="h-5 w-5" />
              Your Workspaces
            </h2>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Workspace
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((ws) => (
              <WorkspaceCard key={ws.id} workspace={ws} onUpdate={() => mutate()} />
            ))}
          </div>
        </>
      ) : (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              Get started with Vizo
            </CardTitle>
            <CardDescription>
              Create a workspace to organize your data sources and start analyzing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create your first workspace
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Recent Analyses Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquareIcon className="h-5 w-5" />
            Recent Analyses
          </CardTitle>
          <CardDescription>Your latest AI-powered data conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <BarChart3Icon className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground text-sm">
              No analyses yet. Create a workspace and connect a data source to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AppHomepage;
