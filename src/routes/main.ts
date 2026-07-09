import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';

// main.ts ফাইলটি আমাদের সব রাউটকে (Route) এক জায়গায় যুক্ত করার কাজ করে।
// এখান থেকে সব রাউটগুলোকে app.ts ফাইলে পাঠানো হয়, ফলে কোড পরিষ্কার থাকে।

const router = Router();

// /api/v1/auth দিয়ে শুরু হওয়া সব রিকোয়েস্ট authRoutes এ চলে যাবে
router.use('/auth', authRoutes);

export default router;