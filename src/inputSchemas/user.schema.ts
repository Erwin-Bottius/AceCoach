import { z } from "zod";
import { classSchema } from "./class.schema";

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom de famille est requis"),
  email: z.string().email("Adresse e-mail invalide"),
  role: z.enum(["TEACHER", "STUDENT"], "Le rôle doit être soit TEACHER, soit STUDENT"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),

  classesTaught: z.array(classSchema).optional(),
  classesJoined: z.array(classSchema).optional(),
  students: z
    .array(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
      }),
    )
    .optional(),
  teachers: z
    .array(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
      }),
    )
    .optional(),
});

export const userUpateSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis").optional(),
  lastName: z.string().min(1, "Le nom de famille est requis").optional(),
  email: z.string().email("Adresse e-mail invalide").optional(),
  role: z.enum(["TEACHER", "STUDENT"], "Le rôle doit être soit TEACHER, soit STUDENT").optional(),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").optional(),
  classesTaught: z.array(classSchema).optional(),
  classesJoined: z.array(classSchema).optional(),
  students: z
    .array(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
      }),
    )
    .optional(),
  teachers: z
    .array(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
      }),
    )
    .optional(),
});

export type UserInput = z.infer<typeof userSchema>;
export type UserUpdateInput = z.infer<typeof userUpateSchema>;
