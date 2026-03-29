import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "passwordMin"),
});

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "passwordMin"),
    confirmPassword: z.string(),
    fullName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "errorPasswordMismatch",
    path: ["confirmPassword"],
  });
