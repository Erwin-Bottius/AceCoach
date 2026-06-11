import { z } from "zod";
import { signupSchema } from "./auth.schema";

export const classSchema = z.object({
  name: z.string(),
  theme: z.string(),
  date: z.iso.datetime({
    message: "date must be a valid ISO 8601 datetime (e.g. 2026-06-11T14:30:00.000Z)",
  }),
  duration: z.number(),
  capacity: z.number().nullable(),
  level: z.string().nullable(),
  location: z.string().nullable().optional(),
  price: z.number().nullable().optional(),
  isPublished: z.boolean().optional(),
  students: z.array(signupSchema).optional(),
  teacherID: z.string(),
});

export type ClassInput = z.infer<typeof classSchema>;

export const classUpdateSchema = classSchema.extend({
  id: z.string(),
});

export type ClassUpdateInput = z.infer<typeof classUpdateSchema>;
