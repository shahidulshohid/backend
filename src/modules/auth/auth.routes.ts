import { Router } from 'express';
import { AuthController } from './auth.controller';

// auth.routes.ts ফাইলটি শুধুমাত্র Authentication (যেমন- register, login) এর রাউটগুলো ম্যানেজ করে।
// প্রতিটি রাউট একটি নির্দিষ্ট Controller ফাংশনের সাথে সংযুক্ত।

const router = Router();

// POST /api/v1/auth/register → ইউজার রেজিস্ট্রেশন করবে এবং OTP পাবে
router.post('/register', AuthController.register);

// POST /api/v1/auth/login → ইউজার email ও password দিয়ে লগইন করবে এবং JWT token পাবে
router.post('/login', AuthController.login);

export default router;