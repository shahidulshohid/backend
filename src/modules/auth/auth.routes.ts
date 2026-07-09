import { Router } from 'express';
import { AuthController } from './auth.controller';
// আমরা validation middleware তৈরি করিনি, তাই সরাসরি Controller কল করব (বা চাইলে একটি সিম্পল validate middleware বানানো যায়)
// আপাতত আমরা validation টা controller এর ভিতরে বা একটি middleware এর মাধ্যমে করতে পারি।

// auth.routes.ts ফাইলটি শুধুমাত্র Authentication (যেমন- register, login) এর রাউটগুলো ম্যানেজ করে।

const router = Router();

// যখন কেউ /api/v1/auth/register এ POST রিকোয়েস্ট করবে, তখন AuthController.register ফাংশনটি কল হবে।
router.post('/register', AuthController.register);

export default router;