"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UnreadMessagesBell } from "@/components/UnreadMessagesBell";
import useSWR from "swr";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import {
  Database,
  MessageSquare,
  BarChart3,
  FileText,
  Users,
  DollarSign,
  Activity,
  Plug,
} from "lucide-react";

interface DailyStats {
  date: string;
  users: number;
  waitlist: number;
}

interface PlanStats {
  name: string;
  count: number;
}

interface VizoStats {
  totalWorkspaces: number;
  totalDataSources: number;
  totalConversations: number;
  totalReports: number;
  queriesToday: number;
  activeUsers7d: number;
  mrr: number;
  topSourceTypes: { type: string; count: number }[];
}

export default function SuperAdminDashboard() {
  const { data: dailyStats } = useSWR<{ data: DailyStats[] }>(
    "/api/super-admin/stats/daily"
  );
  const { data: planStats } = useSWR<{ data: PlanStats[] }>(
    "/api/super-admin/stats/plans"
  );
  const { data: vizoStats } = useSWR<{ data: VizoStats }>(
    "/api/super-admin/stats/vizo"
  );

  const totalUsers = planStats?.data.reduce((acc, curr) => acc + curr.count, 0) || 0;
  const vizo = vizoStats?.data;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Vizo Admin Dashboard</h1>
        <UnreadMessagesBell />
      </div>

      {/* Vizo Platform Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users (7d)</p>
                <p className="text-2xl font-bold">{vizo?.activeUsers7d ?? "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 dark:bg-green-950/30 p-2">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MRR</p>
                <p className="text-2xl font-bold">${vizo?.mrr?.toFixed(0) ?? "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-950/30 p-2">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Queries Today</p>
                <p className="text-2xl font-bold">{vizo?.queriesToday ?? "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 dark:bg-purple-950/30 p-2">
                <Database className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Workspaces</p>
                <p className="text-2xl font-bold">{vizo?.totalWorkspaces ?? "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Plug className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Data Sources</p>
              <p className="text-lg font-semibold">{vizo?.totalDataSources ?? "—"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Conversations</p>
              <p className="text-lg font-semibold">{vizo?.totalConversations ?? "—"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Reports</p>
              <p className="text-lg font-semibold">{vizo?.totalReports ?? "—"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Top Source Type</p>
              <p className="text-lg font-semibold">{vizo?.topSourceTypes?.[0]?.type ?? "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8">
        {/* Daily Stats Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyStats?.data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date: string) =>
                    format(parseISO(date), "MMM dd")
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date: string) =>
                    format(parseISO(date), "MMM dd, yyyy")
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8884d8"
                  name="New Users"
                />
                <Line
                  type="monotone"
                  dataKey="waitlist"
                  stroke="#82ca9d"
                  name="Waitlist Entries"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plan Distribution Cards */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">User Distribution by Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {planStats?.data.map((plan) => (
              <Card key={plan.name} className={plan.name === "No Plan" ? "border-dashed" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    <div className="text-3xl font-bold">{plan.count}</div>
                    <div className="text-sm text-muted-foreground">
                      {((plan.count / totalUsers) * 100).toFixed(1)}% of users
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
