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

// ──────────────────────────────────────────────────────────
// Verify OTP Validation Schema
// ──────────────────────────────────────────────────────────
// OTP ভেরিফাই করার সময় ইউজারকে ইমেইল এবং OTP কোড পাঠাতে হবে।
export const verifyOtpValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
});

// ──────────────────────────────────────────────────────────
// Resend OTP Validation Schema
// ──────────────────────────────────────────────────────────
// OTP পুনরায় পাঠানোর সময় শুধু ইমেইল দরকার হবে।
export const resendOtpValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

// ──────────────────────────────────────────────────────────
// Forgot Password Validation Schema
// ──────────────────────────────────────────────────────────
// পাসওয়ার্ড ভুলে গেলে ইউজার তার ইমেইল দেবে, তারপর OTP পাঠানো হবে।
export const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

// ──────────────────────────────────────────────────────────
// Verify Forgot Password OTP Validation Schema
// ──────────────────────────────────────────────────────────
// Forgot password OTP verify করার সময় ইমেইল ও OTP দরকার হবে।
export const verifyForgotPasswordOtpValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
});

// ──────────────────────────────────────────────────────────
// Reset Password Validation Schema
// ──────────────────────────────────────────────────────────
// নতুন পাসওয়ার্ড সেট করার সময় ইমেইল, OTP এবং নতুন পাসওয়ার্ড দরকার হবে।
export const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
  }),
});

// ──────────────────────────────────────────────────────────
// Refresh Token Validation Schema
// ──────────────────────────────────────────────────────────
// Access Token মেয়াদ শেষ হলে ইউজার refreshToken দিয়ে নতুন token পাবে।
export const refreshTokenValidationSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Refresh token is required'),
  }),
});

// ──────────────────────────────────────────────────────────
// Change Password Validation Schema
// ──────────────────────────────────────────────────────────
// লগইন করা ইউজার পুরনো পাসওয়ার্ড দিয়ে নতুন পাসওয়ার্ড সেট করবে।
export const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
  }),
});