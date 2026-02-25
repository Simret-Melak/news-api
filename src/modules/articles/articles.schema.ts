import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150, "Title must be 1–150 characters"),
  content: z.string().trim().min(50, "Content must be at least 50 characters"),
  category: z.string().trim().min(1, "Category is required"),
  status: z.enum(["Draft", "Published"]).optional(),
});

export const updateArticleSchema = z.object({
  title: z.string().trim().min(1).max(150).optional(),
  content: z.string().trim().min(50).optional(),
  category: z.string().trim().min(1).optional(),
  status: z.enum(["Draft", "Published"]).optional(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;