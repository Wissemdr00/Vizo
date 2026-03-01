import { NextResponse } from "next/server";
import withSuperAdmin from "@/lib/auth/withSuperAdmin";
import { db } from "@/db";
import { workspaces } from "@/db/schema/workspaces";
import { conversations } from "@/db/schema/conversations";
import { messages } from "@/db/schema/messages";
import { dataSources } from "@/db/schema/data-sources";
import { reports } from "@/db/schema/reports";
import { users } from "@/db/schema/users";
import { subscriptions } from "@/db/schema/subscriptions";
import { plans } from "@/db/schema/plans";
import { sql, eq, gte, and } from "drizzle-orm";

export const GET = withSuperAdmin(async () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Total counts
  const [totalWorkspaces] = await db
    .select({ count: sql<number>`count(*)` })
    .from(workspaces);

  const [totalDataSources] = await db
    .select({ count: sql<number>`count(*)` })
    .from(dataSources);

  const [totalConversations] = await db
    .select({ count: sql<number>`count(*)` })
    .from(conversations);

  const [totalReports] = await db
    .select({ count: sql<number>`count(*)` })
    .from(reports);

  // Messages today (proxy for queries today)
  const [queriesToday] = await db
    .select({ count: sql<number>`count(*)` })
    .from(messages)
    .where(
      and(
        eq(messages.role, "user"),
        gte(messages.createdAt, today)
      )
    );

  // Active users (7 days) — users who have messages in last 7 days
  const activeUsersResult = await db
    .select({ count: sql<number>`count(distinct ${conversations.userId})` })
    .from(conversations)
    .innerJoin(messages, eq(messages.conversationId, conversations.id))
    .where(gte(messages.createdAt, sevenDaysAgo));
  const activeUsers7d = activeUsersResult[0]?.count || 0;

  // MRR calculation (sum of active subscription plan prices / 12 for annual)
  const mrrResult = await db
    .select({
      totalMonthly: sql<number>`COALESCE(SUM(CASE WHEN ${plans.interval} = 'month' THEN ${plans.price} ELSE 0 END), 0)`,
      totalAnnual: sql<number>`COALESCE(SUM(CASE WHEN ${plans.interval} = 'year' THEN ${plans.price} / 12 ELSE 0 END), 0)`,
    })
    .from(subscriptions)
    .innerJoin(plans, eq(subscriptions.planId, plans.id))
    .where(eq(subscriptions.status, "active"));
  const mrr = ((mrrResult[0]?.totalMonthly || 0) + (mrrResult[0]?.totalAnnual || 0)) / 100;

  // Top data source types
  const topSourceTypes = await db
    .select({
      type: dataSources.type,
      count: sql<number>`count(*)`,
    })
    .from(dataSources)
    .groupBy(dataSources.type)
    .orderBy(sql`count(*) desc`)
    .limit(5);

  return NextResponse.json({
    data: {
      totalWorkspaces: totalWorkspaces.count,
      totalDataSources: totalDataSources.count,
      totalConversations: totalConversations.count,
      totalReports: totalReports.count,
      queriesToday: queriesToday.count,
      activeUsers7d,
      mrr,
      topSourceTypes,
    },
  });
});
