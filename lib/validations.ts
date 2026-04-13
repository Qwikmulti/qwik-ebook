import { z } from "zod";

export const subscribeSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const ebookUploadSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long")
    .trim(),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type EbookUploadInput = z.infer<typeof ebookUploadSchema>;
