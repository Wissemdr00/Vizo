"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
  DatabaseIcon,
  MessageSquareIcon,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import type { WorkspaceListItem } from "@/lib/workspaces/useWorkspaces";

interface WorkspaceCardProps {
  workspace: WorkspaceListItem;
  onUpdate: () => void;
}

export default function WorkspaceCard({ workspace, onUpdate }: WorkspaceCardProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newName, setNewName] = useState(workspace.name);
  const [loading, setLoading] = useState(false);

  const handleRename = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/app/workspaces/${workspace.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to rename");
      toast.success("Workspace renamed");
      setRenameOpen(false);
      onUpdate();
    } catch {
      toast.error("Failed to rename workspace");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/app/workspaces/${workspace.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Workspace deleted");
      setDeleteOpen(false);
      onUpdate();
    } catch {
      toast.error("Failed to delete workspace");
    } finally {
      setLoading(false);
    }
  };

  const lastActivity = workspace.updatedAt
    ? new Date(workspace.updatedAt).toLocaleDateString()
    : "—";

  return (
    <>
      <Card className="group relative hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{workspace.name}</CardTitle>
              {workspace.description && (
                <CardDescription className="line-clamp-2 mt-1">
                  {workspace.description}
                </CardDescription>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setNewName(workspace.name);
                    setRenameOpen(true);
                  }}
                >
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteOpen(true)}
                  className="text-destructive"
                >
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <DatabaseIcon className="h-3.5 w-3.5" />
              {workspace.dataSourceCount} sources
            </span>
            <span className="flex items-center gap-1">
              <MessageSquareIcon className="h-3.5 w-3.5" />
              {workspace.conversationCount} chats
            </span>
            <span className="ml-auto text-xs">Last: {lastActivity}</span>
          </div>
        </CardContent>
      </Card>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Workspace</DialogTitle>
            <DialogDescription>Enter a new name for this workspace.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="workspace-name">Name</Label>
            <Input
              id="workspace-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={loading || !newName.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{workspace.name}&quot; and all its data
              sources, conversations, and charts. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
