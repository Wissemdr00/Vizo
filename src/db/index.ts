import { drizzle } from "drizzle-orm/postgres-js";
import * as userSchema from "./schema/user";
import * as plansSchema from "./schema/plans";
import * as workspacesSchema from "./schema/workspaces";
import * as dataSourcesSchema from "./schema/data-sources";
import * as conversationsSchema from "./schema/conversations";
import * as messagesSchema from "./schema/messages";
import * as chartsSchema from "./schema/charts";
import * as reportsSchema from "./schema/reports";

export const db = drizzle(process.env.DATABASE_URL!);

export * from "./schema/user";
export * from "./schema/plans";
export * from "./schema/workspaces";
export * from "./schema/data-sources";
export * from "./schema/conversations";
export * from "./schema/messages";
export * from "./schema/charts";
export * from "./schema/reports";