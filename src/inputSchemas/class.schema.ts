import { z } from "zod";
import { signupSchema } from "./auth.schema";

export const classSchema = z.object({
  name: z.string(),
  theme: z.string(),
  date: z.string(),
  duration: z.number(),
  capacity: z.number().nullable(),
  level: z.string().nullable(),
  students: z.array(signupSchema).optional(),
  teacherID: z.string(),
});

export type ClassInput = z.infer<typeof classSchema>;

export const classUpdateSchema = classSchema.extend({
  id: z.string(),
});

export type ClassUpdateInput = z.infer<typeof classUpdateSchema>;
