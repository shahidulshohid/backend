import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';

// main.ts ফাইলটি আমাদের সব রাউটকে (Route) এক জায়গায় যুক্ত করার কাজ করে।
// এখান থেকে সব রাউটগুলোকে app.ts ফাইলে পাঠানো হয়, ফলে কোড পরিষ্কার থাকে।

const router = Router();

// /api/v1/auth দিয়ে শুরু হওয়া সব রিকোয়েস্ট authRoutes এ চলে যাবে
router.use('/auth', authRoutes);

// /api/v1/users দিয়ে শুরু হওয়া সব রিকোয়েস্ট userRoutes এ চলে যাবে
router.use('/users', userRoutes);

export default router;