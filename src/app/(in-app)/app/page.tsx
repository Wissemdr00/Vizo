"use client";
import React from "react";
import useCurrentPlan from "@/lib/users/useCurrentPlan";
import useUser from "@/lib/users/useUser";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  DatabaseIcon,
  MessageSquareIcon,
  BarChart3Icon,
  UploadIcon,
  LinkIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import useCredits from "@/lib/users/useCredits";

function AppHomepage() {
  const { currentPlan, isLoading: planLoading } = useCurrentPlan();
  const { credits, isLoading: creditsLoading } = useCredits();
  const { user, isLoading: userLoading } = useUser();

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const aiQueryCredits = (credits as Record<string, number> | null)?.ai_query ?? 0;

  const quickActions = [
    {
      title: "Upload a File",
      description: "CSV, Excel, JSON, or Parquet",
      icon: UploadIcon,
      href: "#",
      variant: "default" as const,
    },
    {
      title: "Connect a Database",
      description: "PostgreSQL, MySQL, MongoDB…",
      icon: DatabaseIcon,
      href: "#",
      variant: "outline" as const,
    },
    {
      title: "Connect Cloud Source",
      description: "Google Sheets, Airtable, Notion…",
      icon: LinkIcon,
      href: "#",
      variant: "outline" as const,
    },
  ];

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
              <DatabaseIcon className="h-5 w-5 text-blue-500" />
              0
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="link" className="p-0 h-auto text-xs">
              Create workspace →
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Get Started */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Get started with Vizo
          </CardTitle>
          <CardDescription>
            Connect your first data source to start chatting with your data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                asChild
                variant={action.variant}
                className="h-auto flex-col gap-2 py-4"
              >
                <Link href={action.href}>
                  <action.icon className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs opacity-70">{action.description}</div>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

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
              No analyses yet. Connect a data source to get started.
            </p>
            <Button size="sm" variant="outline">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AppHomepage;
