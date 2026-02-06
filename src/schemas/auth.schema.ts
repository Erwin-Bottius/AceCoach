import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom de famille est requis"),
  role: z.enum(
    ["TEACHER", "STUDENT"],
    "Le rôle doit être soit Prof, soit élève",
  ),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;
