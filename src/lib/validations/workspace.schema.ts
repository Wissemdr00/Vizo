import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
});

export type CreateWorkspaceValues = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").optional(),
  description: z.string().max(500, "Description too long").optional(),
});

export type UpdateWorkspaceValues = z.infer<typeof updateWorkspaceSchema>;
