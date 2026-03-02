import { NextResponse } from "next/server";
import withSuperAdminAuthRequired from "@/lib/auth/withSuperAdminAuthRequired";
import { db } from "@/db";
import { workspaces } from "@/db/schema/workspaces";
import { conversations } from "@/db/schema/conversations";
import { messages } from "@/db/schema/messages";
import { dataSources } from "@/db/schema/data-sources";
import { reports } from "@/db/schema/reports";
import { users } from "@/db/schema/user";
import { plans } from "@/db/schema/plans";
import { sql, eq, gte, and, isNotNull } from "drizzle-orm";

export const GET = withSuperAdminAuthRequired(async () => {
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

  // Active users (7 days) — users with workspace conversations updated recently
  const activeUsersResult = await db
    .select({ count: sql<number>`count(distinct ${workspaces.userId})` })
    .from(workspaces)
    .innerJoin(conversations, eq(conversations.workspaceId, workspaces.id))
    .innerJoin(messages, eq(messages.conversationId, conversations.id))
    .where(gte(messages.createdAt, sevenDaysAgo));
  const activeUsers7d = activeUsersResult[0]?.count || 0;

  // MRR calculation: count users per plan, multiply by monthly price
  const mrrResult = await db
    .select({
      monthlyPrice: plans.monthlyPrice,
      yearlyPrice: plans.yearlyPrice,
      userCount: sql<number>`count(*)`,
    })
    .from(users)
    .innerJoin(plans, eq(users.planId, plans.id))
    .where(isNotNull(users.planId))
    .groupBy(plans.id, plans.monthlyPrice, plans.yearlyPrice);

  let mrr = 0;
  for (const row of mrrResult) {
    // Use monthly price if available, else yearly / 12
    const price = row.monthlyPrice || (row.yearlyPrice ? Math.round(row.yearlyPrice / 12) : 0);
    mrr += (price * row.userCount) / 100; // prices stored in cents
  }

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
