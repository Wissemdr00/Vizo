"use client";

import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  ScatterChart, Scatter, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";

interface ChartConfig {
  xAxis: string;
  yAxis: string | string[];
  groupBy?: string;
  colors: string[];
}

interface ChartRendererProps {
  chartType: "bar" | "line" | "area" | "scatter" | "pie" | "donut" | "table";
  title: string;
  config: ChartConfig;
  data: Record<string, unknown>[];
  onSave?: () => void;
}

const DEFAULT_COLORS = ["#7c3aed", "#2563eb", "#059669", "#d97706", "#dc2626", "#6366f1"];

export default function ChartRenderer({
  chartType,
  title,
  config,
  data,
  onSave,
}: ChartRendererProps) {
  const colors = config.colors || DEFAULT_COLORS;
  const yAxes = Array.isArray(config.yAxis) ? config.yAxis : [config.yAxis];

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey={config.xAxis} className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Legend />
              {yAxes.map((y, i) => (
                <Bar key={y} dataKey={y} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey={config.xAxis} className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Legend />
              {yAxes.map((y, i) => (
                <Line key={y} type="monotone" dataKey={y} stroke={colors[i % colors.length]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey={config.xAxis} className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Legend />
              {yAxes.map((y, i) => (
                <Area key={y} type="monotone" dataKey={y} fill={colors[i % colors.length]} stroke={colors[i % colors.length]} fillOpacity={0.3} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey={config.xAxis} name={config.xAxis} className="text-xs" />
              <YAxis dataKey={yAxes[0]} name={yAxes[0]} className="text-xs" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={data} fill={colors[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case "pie":
      case "donut":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data}
                dataKey={yAxes[0]}
                nameKey={config.xAxis}
                cx="50%"
                cy="50%"
                outerRadius={chartType === "donut" ? 120 : 140}
                innerRadius={chartType === "donut" ? 60 : 0}
                label
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case "table":
        const cols = data.length > 0 ? Object.keys(data[0]) : [];
        return (
          <div className="rounded-md border overflow-auto max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  {cols.map((col) => (
                    <TableHead key={col}>{col}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.slice(0, 100).map((row, i) => (
                  <TableRow key={i}>
                    {cols.map((col) => (
                      <TableCell key={col}>{String(row[col] ?? "")}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );

      default:
        return <p className="text-muted-foreground">Unsupported chart type: {chartType}</p>;
    }
  };

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">{title}</h3>
        {onSave && (
          <Button variant="outline" size="sm" onClick={onSave}>
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
        )}
      </div>
      {renderChart()}
    </div>
  );
}
