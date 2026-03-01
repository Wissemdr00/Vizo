"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import useDataSource from "@/lib/data-sources/useDataSource";
import DataPreviewTable from "@/components/data-sources/data-preview-table";

export default function DataSourceDetailPage() {
  const { id: workspaceId, sourceId } = useParams<{ id: string; sourceId: string }>();
  const { dataSource, isLoading } = useDataSource(sourceId);

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!dataSource) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <p>Data source not found.</p>
      </div>
    );
  }

  const schema = dataSource.schema as {
    columns?: { name: string; type: string; nullPercentage: number }[];
    previewRows?: Record<string, unknown>[];
    rowCount?: number;
    tables?: unknown[];
  } | null;

  const isFileType = ["csv", "excel", "json"].includes(dataSource.type);
  const isDbType = ["postgresql", "mysql"].includes(dataSource.type);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/app/workspace/${workspaceId}/sources`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{dataSource.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{dataSource.type.toUpperCase()}</Badge>
            {dataSource.config?.fileName && (
              <span className="text-sm text-muted-foreground">{dataSource.config.fileName}</span>
            )}
          </div>
        </div>
      </div>

      {/* File-based preview */}
      {isFileType && schema?.columns && (
        <DataPreviewTable
          columns={schema.columns}
          rows={schema.previewRows || []}
          rowCount={schema.rowCount || 0}
        />
      )}

      {/* Database schema view */}
      {isDbType && schema?.tables && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Database Schema ({(schema.tables as { name: string }[]).length} tables)
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {(schema.tables as { name: string; columns: { name: string; type: string; isPrimaryKey: boolean }[]; estimatedRowCount: number }[]).map((table) => (
              <div key={table.name} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{table.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    ~{table.estimatedRowCount.toLocaleString()} rows
                  </span>
                </div>
                <div className="space-y-1">
                  {table.columns.slice(0, 8).map((col) => (
                    <div key={col.name} className="flex items-center gap-2 text-xs">
                      {col.isPrimaryKey && <Badge variant="outline" className="text-[10px] px-1">PK</Badge>}
                      <span className="font-mono">{col.name}</span>
                      <span className="text-muted-foreground">{col.type}</span>
                    </div>
                  ))}
                  {table.columns.length > 8 && (
                    <span className="text-xs text-muted-foreground">
                      +{table.columns.length - 8} more columns
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
