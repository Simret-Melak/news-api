import { z } from "zod";

const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/; 

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .regex(nameRegex, "Name must contain only alphabets and spaces"),
  email: z.string().trim().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      strongPasswordRegex,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  role: z.enum(["author", "reader"], { message: "Role must be author or reader" }),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;