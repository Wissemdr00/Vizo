import { z } from "zod";

export const fileUploadSchema = z.object({
  workspaceId: z.string().uuid(),
  fileName: z.string().min(1),
  fileType: z.enum(["csv", "excel", "json"]),
  sheetName: z.string().optional(),
});

export const dbConnectionSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(1).max(100),
  type: z.enum(["postgresql", "mysql"]),
  host: z.string().min(1),
  port: z.number().int().min(1).max(65535),
  database: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  ssl: z.boolean().default(false),
});

export const testConnectionSchema = dbConnectionSchema.omit({
  workspaceId: true,
  name: true,
});
