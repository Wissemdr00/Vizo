"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Column {
  name: string;
  type: string;
  nullPercentage: number;
}

interface DataPreviewTableProps {
  columns: Column[];
  rows: Record<string, unknown>[];
  rowCount: number;
  isLoading?: boolean;
}

export default function DataPreviewTable({
  columns,
  rows,
  rowCount,
  isLoading,
}: DataPreviewTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{columns.length} columns</span>
        <span>•</span>
        <span>{rowCount.toLocaleString()} rows</span>
        {rows.length < rowCount && (
          <>
            <span>•</span>
            <span>Showing first {rows.length}</span>
          </>
        )}
      </div>

      <div className="rounded-md border overflow-auto max-h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.name} className="whitespace-nowrap">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">{col.name}</span>
                    <Badge variant="outline" className="text-[10px] w-fit">
                      {col.type}
                    </Badge>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.name} className="whitespace-nowrap text-xs max-w-[200px] truncate">
                    {row[col.name] == null ? (
                      <span className="text-muted-foreground/50 italic">null</span>
                    ) : (
                      String(row[col.name])
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
