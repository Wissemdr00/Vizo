import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { z } from "zod";
import { conversations } from "./conversations";

export const messageRoleSchema = z.enum(["user", "assistant", "system"]);
export type MessageRole = z.infer<typeof messageRoleSchema>;

type ChartInMessage = {
  type: string;
  title?: string;
  config: Record<string, unknown>;
  data: unknown[];
};

type MessageMeta = {
  sql?: string;
  code?: string;
  language?: "sql" | "python";
  charts?: ChartInMessage[];
  executionTimeMs?: number;
  rowCount?: number;
  error?: string;
};

export const messages = pgTable("messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  conversationId: text("conversationId")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").$type<MessageRole>().notNull(),
  content: text("content").notNull(),
  meta: jsonb("meta").$type<MessageMeta>().default({}),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});
