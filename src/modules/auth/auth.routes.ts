import { Router } from 'express';
import { AuthController } from './auth.controller';
import protect from '../../middlewares/authMiddleware';

// auth.routes.ts ফাইলটি শুধুমাত্র Authentication (যেমন- register, login) এর রাউটগুলো ম্যানেজ করে।
// প্রতিটি রাউট একটি নির্দিষ্ট Controller ফাংশনের সাথে সংযুক্ত।

const router = Router();

// ─── REGISTER FLOW ───────────────────────────────────────────────────────────
// POST /api/v1/auth/register → ইউজার রেজিস্ট্রেশন করবে এবং OTP পাবে
router.post('/register', AuthController.register);

// POST /api/v1/auth/verify-otp → রেজিস্ট্রেশনের পর ইউজার OTP দিয়ে email verify করবে
router.post('/verify-otp', AuthController.verifyOtp);

// POST /api/v1/auth/resend-otp/register → Register OTP expire হলে নতুন OTP চাইবে
router.post('/resend-otp/register', AuthController.resendOtp);

// ─── LOGIN ───────────────────────────────────────────────────────────────────
// POST /api/v1/auth/login → ইউজার email ও password দিয়ে লগইন করবে এবং JWT token পাবে
router.post('/login', AuthController.login);

// ─── FORGOT PASSWORD FLOW ────────────────────────────────────────────────────
// POST /api/v1/auth/forgot-password → ইউজার ইমেইল দেবে, password reset OTP পাবে
router.post('/forgot-password', AuthController.forgotPassword);

// POST /api/v1/auth/verify-forgot-password-otp → Forgot password OTP যাচাই করা হবে
router.post('/verify-forgot-password-otp', AuthController.verifyForgotPasswordOtp);

// POST /api/v1/auth/resend-otp/forgot-password → Forgot password OTP expire হলে নতুন OTP
router.post('/resend-otp/forgot-password', AuthController.resendForgotPasswordOtp);

// POST /api/v1/auth/reset-password → OTP verify এর পর নতুন password সেট করবে
router.post('/reset-password', AuthController.resetPassword);

// ─── TOKEN ───────────────────────────────────────────────────────────────────
// POST /api/v1/auth/refresh-token → Access Token মেয়াদ শেষ হলে নতুন token নেবে
router.post('/refresh-token', AuthController.refreshToken);

// ─── PROTECTED ROUTES (JWT লাগবে) ────────────────────────────────────────────
// POST /api/v1/auth/change-password → লগইন করা ইউজার তার password পরিবর্তন করবে
// protect middleware JWT verify করে, তারপর Controller কল হবে
router.post('/change-password', protect, AuthController.changePassword);

export default router;