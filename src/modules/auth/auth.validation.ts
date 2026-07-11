import { z } from 'zod';

// auth.validation.ts ফাইলটি ইউজারের পাঠানো ডাটা ভ্যালিডেশন (Validation) করার জন্য ব্যবহৃত হয়।
// এখানে Zod লাইব্রেরি ব্যবহার করে আমরা নিশ্চিত করি যে ইউজার সঠিক ফরম্যাটে ডাটা পাঠাচ্ছে।

// ──────────────────────────────────────────────────────────
// Register Validation Schema
// ──────────────────────────────────────────────────────────
// রেজিস্ট্রেশনের সময় ইউজারকে নাম, ইমেইল এবং পাসওয়ার্ড পাঠাতে হবে।
export const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

// ──────────────────────────────────────────────────────────
// Login Validation Schema
// ──────────────────────────────────────────────────────────
// লগইনের সময় ইউজারকে শুধু ইমেইল এবং পাসওয়ার্ড পাঠাতে হবে।
export const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});