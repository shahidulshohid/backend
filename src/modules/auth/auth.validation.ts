import { z } from 'zod';

// auth.validation.ts ফাইলটি ইউজারের পাঠানো ডাটা ভ্যালিডেশন (Validation) করার জন্য ব্যবহৃত হয়।
// 유জার Register করার সময় সঠিক ফরম্যাটে নাম, ইমেইল এবং পাসওয়ার্ড দিচ্ছে কিনা তা চেক করার জন্য Zod ব্যবহার করা হয়েছে।

export const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});