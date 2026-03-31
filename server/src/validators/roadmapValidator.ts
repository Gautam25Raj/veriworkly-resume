import { z } from "zod";

export const roadmapQuerySchema = z.object({
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  sort: z.enum(["newest", "oldest", "recently-completed"]).optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

const roadmapDetailsSchema = z
  .object({
    fullDescription: z.string().optional(),
    whyItMatters: z.string().optional(),
    timeline: z.string().optional(),
    items: z
      .array(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          image: z.string().optional(),
        }),
      )
      .optional(),
  })
  .optional();

export const roadmapAdminCreateSchema = z.object({
  id: z.string().min(1).optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(["todo", "in-progress", "done"]).default("todo"),
  eta: z.string().optional(),
  tags: z.array(z.string()).optional(),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  completedQuarter: z.string().optional(),
  details: roadmapDetailsSchema,
});

export const roadmapAdminUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    status: z.enum(["todo", "in-progress", "done"]).optional(),
    eta: z.string().optional(),
    tags: z.array(z.string()).optional(),
    startedAt: z.string().datetime().optional().nullable(),
    completedAt: z.string().datetime().optional().nullable(),
    completedQuarter: z.string().optional().nullable(),
    details: roadmapDetailsSchema.nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for update",
  });
