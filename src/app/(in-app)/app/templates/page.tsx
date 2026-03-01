"use client";

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
import { ArrowLeft, Play } from "lucide-react";
import Link from "next/link";

const templates = [
  {
    id: "ad_campaign",
    name: "Ad Campaign Performance",
    icon: "📊",
    description: "Analyze spend, impressions, clicks, conversions, ROAS, and CPA across campaigns.",
    requiredData: "Campaign name, spend, impressions, clicks, conversions",
    color: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    id: "sales_kpi",
    name: "Sales KPI Dashboard",
    icon: "📈",
    description: "Revenue trends, top products, average order value, and growth analysis.",
    requiredData: "Revenue, date, product, quantity",
    color: "bg-green-50 dark:bg-green-950/30",
  },
  {
    id: "financial",
    name: "Financial Overview",
    icon: "💰",
    description: "P&L breakdown, expense categories, margins, and budget vs actual.",
    requiredData: "Amount, category, date",
    color: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    id: "ecommerce",
    name: "E-commerce Analytics",
    icon: "🛒",
    description: "Conversion rate, AOV, LTV, cart abandonment, and product performance.",
    requiredData: "Order ID, revenue, customer, product",
    color: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    id: "user_analytics",
    name: "User/Customer Analytics",
    icon: "👥",
    description: "Retention cohorts, engagement metrics, and growth trends.",
    requiredData: "User ID, signup date, activity date",
    color: "bg-indigo-50 dark:bg-indigo-950/30",
  },
  {
    id: "churn",
    name: "Churn & Retention Analysis",
    icon: "📉",
    description: "Churn rate, retention curves, at-risk segments, and win-back opportunities.",
    requiredData: "Customer ID, status, date",
    color: "bg-red-50 dark:bg-red-950/30",
  },
  {
    id: "operations",
    name: "Operations Metrics",
    icon: "⚙️",
    description: "Delivery times, quality metrics, efficiency, and resource utilization.",
    requiredData: "Status, duration, date",
    color: "bg-slate-50 dark:bg-slate-950/30",
  },
];

export default function TemplatesPage() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/app">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Analysis Templates</h1>
          <p className="text-muted-foreground text-sm">
            Pre-built analysis workflows. Upload your data and let AI do the rest.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((tmpl) => (
          <Card key={tmpl.id} className={`hover:shadow-md transition-shadow ${tmpl.color}`}>
            <CardHeader>
              <div className="text-3xl mb-2">{tmpl.icon}</div>
              <CardTitle className="text-lg">{tmpl.name}</CardTitle>
              <CardDescription className="text-sm">
                {tmpl.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Required data:</span>
                  <p className="text-xs mt-0.5">{tmpl.requiredData}</p>
                </div>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link href={`/app?template=${tmpl.id}`}>
                    <Play className="h-3 w-3 mr-1" />
                    Run Template
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
