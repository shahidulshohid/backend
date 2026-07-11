import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { 
  registerValidationSchema, 
  loginValidationSchema,
  verifyOtpValidationSchema,
  resendOtpValidationSchema,
} from './auth.validation';

// auth.controller.ts ফাইলটির কাজ হলো ইউজারের রিকোয়েস্ট (Request) রিসিভ করা এবং রেসপন্স (Response) দেওয়া।
// এখানে কোনো ডাটাবেজ লজিক থাকে না, ডাটাবেজের কাজগুলো AuthService করে থাকে।

// ──────────────────────────────────────────────────────────
// Register Controller
// ──────────────────────────────────────────────────────────
const register = asyncHandler(async (req: Request, res: Response) => {
  // 1. Zod দিয়ে ইউজার সঠিক ডাটা দিয়েছে কিনা তা চেক করা হচ্ছে
  const validationResult = registerValidationSchema.safeParse({ body: req.body });
  
  if (!validationResult.success) {
    // যদি ডাটা ভুল হয় (যেমন- ইমেইল ফরম্যাট ভুল বা পাসওয়ার্ড ছোট), তবে এরর রেসপন্স দেওয়া হবে
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: validationResult.error.issues,
    });
    return;
  }

  // 2. সঠিক ডাটা পেলে AuthService কে ডাটা সেভ করার জন্য পাঠানো হচ্ছে
  const result = await AuthService.registerUser(req.body);

  // 3. সবশেষে ইউজারকে একটি সুন্দর রেসপন্স (ApiResponse) পাঠানো হচ্ছে
  res.status(201).json(
    new ApiResponse(
      201, 
      result, 
      'OTP sent to email. Please verify to complete registration.'
    )
  );
});

// ──────────────────────────────────────────────────────────
// Verify OTP Controller (Register এর পরে OTP verify করার জন্য)
// ──────────────────────────────────────────────────────────
const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  // 1. Zod দিয়ে email ও otp সঠিকভাবে দেওয়া হয়েছে কিনা চেক করা হচ্ছে
  const validationResult = verifyOtpValidationSchema.safeParse({ body: req.body });

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: validationResult.error.issues,
    });
    return;
  }

  // 2. AuthService-কে OTP যাচাই করতে বলা হচ্ছে
  const result = await AuthService.verifyOtpUser(req.body);

  // 3. সফলভাবে verify হলে ইউজারকে token সহ রেসপন্স দেওয়া হচ্ছে — ইউজার সরাসরি লগইন হয়ে যাবে
  res.status(200).json(
    new ApiResponse(
      200,
      result,
      'Email verified successfully. You are now logged in.'
    )
  );
});

// ──────────────────────────────────────────────────────────
// Resend OTP Controller (Register এর জন্য নতুন OTP পাঠানো)
// ──────────────────────────────────────────────────────────
const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  // 1. Zod দিয়ে email সঠিকভাবে দেওয়া হয়েছে কিনা চেক করা হচ্ছে
  const validationResult = resendOtpValidationSchema.safeParse({ body: req.body });

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: validationResult.error.issues,
    });
    return;
  }

  // 2. AuthService-কে নতুন OTP তৈরি করে পাঠাতে বলা হচ্ছে
  const result = await AuthService.resendOtpUser(req.body);

  // 3. সফলভাবে OTP পাঠানো হলে ইউজারকে confirm করা হচ্ছে
  res.status(200).json(
    new ApiResponse(
      200,
      result,
      'A new OTP has been sent to your email.'
    )
  );
});

// ──────────────────────────────────────────────────────────
// Login Controller
// ──────────────────────────────────────────────────────────
const login = asyncHandler(async (req: Request, res: Response) => {
  // 1. Zod দিয়ে ইউজার সঠিক email এবং password দিয়েছে কিনা তা চেক করা হচ্ছে
  const validationResult = loginValidationSchema.safeParse({ body: req.body });

  if (!validationResult.success) {
    // যদি ডাটা ভুল হয় তবে এরর রেসপন্স দেওয়া হবে
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: validationResult.error.issues,
    });
    return;
  }

  // 2. সঠিক ডাটা পেলে AuthService কে email ও password দিয়ে যাচাই করতে বলা হচ্ছে
  const result = await AuthService.loginUser(req.body);

  // 3. সফলভাবে লগইন হলে ইউজারকে তার ডাটা ও JWT Token সহ রেসপন্স দেওয়া হচ্ছে
  res.status(200).json(
    new ApiResponse(
      200,
      result,
      'Login successful'
    )
  );
});

export const AuthController = {
  register,
  verifyOtp,  // OTP verify controller
  resendOtp,  // OTP resend controller
  login,
};