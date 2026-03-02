"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { ArrowLeft, FileText, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import useReports from "@/lib/reports/useReports";

const templateLabels: Record<string, string> = {
  ad_campaign: "📊 Ad Campaign",
  sales_kpi: "📈 Sales KPI",
  financial: "💰 Financial",
  ecommerce: "🛒 E-commerce",
  user_analytics: "👥 User Analytics",
  churn: "📉 Churn & Retention",
  operations: "⚙️ Operations",
  custom: "📋 Custom",
};

export default function ReportsPage() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { reports, isLoading, mutate } = useReports(workspaceId);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/app/reports/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Report deleted");
      mutate();
    } catch {
      toast.error("Failed to delete report");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/app/workspace/${workspaceId}/sources`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground text-sm">
            AI-generated analysis reports for your data
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-1">No reports yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Run an analysis template or ask the AI to generate a report
            </p>
            <Button variant="outline" asChild>
              <Link href="/app/templates">Browse Templates</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report: Record<string, unknown>) => {
            const sections = (report.sections as { title: string }[]) || [];
            return (
              <Card key={report.id as string} className="group">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div>
                    <CardTitle className="text-base">{report.title as string}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {templateLabels[report.template as string] || String(report.template)}
                      </Badge>
                      <span className="text-xs">
                        {new Date(report.createdAt as string).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive"
                    onClick={() => setDeleteId(report.id as string)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {sections.length} sections
                    {(report.meta as { generatedInsights?: string[] })?.generatedInsights?.length
                      ? ` • ${(report.meta as { generatedInsights: string[] }).generatedInsights.length} insights`
                      : ""}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete report?</AlertDialogTitle>
            <AlertDialogDescription>This report will be permanently removed.</AlertDialogDescription>
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
