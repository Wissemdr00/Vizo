"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { ArrowLeft, BarChart3, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import useCharts from "@/lib/charts/useCharts";
import ChartRenderer from "@/components/visualization/chart-renderer";

export default function ChartGalleryPage() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { charts, isLoading, mutate } = useCharts(workspaceId);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/app/charts/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Chart deleted");
      mutate();
    } catch {
      toast.error("Failed to delete chart");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/app/workspace/${workspaceId}/sources`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Chart Gallery</h1>
          <p className="text-muted-foreground text-sm">
            Saved visualizations from your analysis sessions
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[400px] rounded-xl" />
          ))}
        </div>
      ) : charts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <BarChart3 className="h-12 w-12 mb-3 opacity-30" />
          <h3 className="text-lg font-medium">No saved charts yet</h3>
          <p className="text-sm mt-1">Charts you save from conversations will appear here</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {charts.map((chart: Record<string, unknown>) => (
            <div key={chart.id as string} className="relative group">
              <ChartRenderer
                chartType={chart.type as "bar"}
                title={chart.title as string}
                config={chart.config as { xAxis: string; yAxis: string; colors: string[] }}
                data={(chart.data as Record<string, unknown>[]) || []}
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setDeleteId(chart.id as string)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chart?</AlertDialogTitle>
            <AlertDialogDescription>This chart will be permanently removed from your gallery.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
