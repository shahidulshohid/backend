import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { 
  registerValidationSchema, 
  loginValidationSchema,
  verifyOtpValidationSchema,
  resendOtpValidationSchema,
  forgotPasswordValidationSchema,
  verifyForgotPasswordOtpValidationSchema,
  resetPasswordValidationSchema,
  refreshTokenValidationSchema,
  changePasswordValidationSchema,
  googleLoginValidationSchema,
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

// ──────────────────────────────────────────────────────────
// Forgot Password Controller
// ──────────────────────────────────────────────────────────
// ইউজার পাসওয়ার্ড ভুলে গেলে তার ইমেইলে OTP পাঠানো হবে।
const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  // 1. Zod দিয়ে email সঠিকভাবে দেওয়া হয়েছে কিনা চেক করা হচ্ছে
  const validationResult = forgotPasswordValidationSchema.safeParse({ body: req.body });

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: validationResult.error.issues,
    });
    return;
  }

  // 2. AuthService-কে OTP তৈরি করে ইমেইলে পাঠাতে বলা হচ্ছে
  const result = await AuthService.forgotPassword(req.body);

  // 3. সফলভাবে OTP পাঠানো হলে ইউজারকে জানানো হচ্ছে
  res.status(200).json(
    new ApiResponse(
      200,
      result,
      'Password reset OTP sent to your email.'
    )
  );
});

// ──────────────────────────────────────────────────────────
// Verify Forgot Password OTP Controller
// ──────────────────────────────────────────────────────────
// ইউজারের দেওয়া OTP সঠিক কিনা যাচাই করা হবে।
const verifyForgotPasswordOtp = asyncHandler(async (req: Request, res: Response) => {
  // 1. Zod দিয়ে email ও OTP সঠিকভাবে দেওয়া হয়েছে কিনা চেক করা হচ্ছে
  const validationResult = verifyForgotPasswordOtpValidationSchema.safeParse({ body: req.body });

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: validationResult.error.issues,
    });
    return;
  }

  // 2. AuthService-কে OTP যাচাই করতে বলা হচ্ছে
  const result = await AuthService.verifyForgotPasswordOtp(req.body);

  // 3. OTP সঠিক হলে ইউজারকে জানানো হচ্ছে — পরের ধাপে সে নতুন password দিতে পারবে
  res.status(200).json(
    new ApiResponse(
      200,
      result,
      'OTP verified. You can now reset your password.'
    )
  );
});

// ──────────────────────────────────────────────────────────
// Resend Forgot Password OTP Controller
// ──────────────────────────────────────────────────────────
// Forgot password OTP expire হলে নতুন OTP পাঠানো হবে।
const resendForgotPasswordOtp = asyncHandler(async (req: Request, res: Response) => {
  // 1. Zod দিয়ে email সঠিকভাবে দেওয়া হয়েছে কিনা চেক করা হচ্ছে
  const validationResult = forgotPasswordValidationSchema.safeParse({ body: req.body });

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: validationResult.error.issues,
    });
    return;
  }

  // 2. AuthService-কে নতুন OTP তৈরি করে পাঠাতে বলা হচ্ছে
  const result = await AuthService.resendForgotPasswordOtp(req.body);

  // 3. সফলভাবে নতুন OTP পাঠানো হলে ইউজারকে জানানো হচ্ছে
  res.status(200).json(
    new ApiResponse(
      200,
      result,
      'A new password reset OTP has been sent to your email.'
    )
  );
});

// ──────────────────────────────────────────────────────────
// Reset Password Controller
// ──────────────────────────────────────────────────────────
// Forgot password OTP verify করার পর ইউজার নতুন পাসওয়ার্ড সেট করতে পারবে।
const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  // 1. Zod দিয়ে email, otp ও newPassword সঠিকভাবে দেওয়া হয়েছে কিনা চেক করা হচ্ছে
  const validationResult = resetPasswordValidationSchema.safeParse({ body: req.body });

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: validationResult.error.issues,
    });
    return;
  }

  // 2. AuthService-কে OTP check করে নতুন পাসওয়ার্ড সেট করতে বলা হচ্ছে
  const result = await AuthService.resetPassword(req.body);

  // 3. সফলভাবে password reset হলে ইউজারকে জানানো হচ্ছে
  res.status(200).json(
    new ApiResponse(
      200,
      result,
      'Password reset successful.'
    )
  );
});

// ──────────────────────────────────────────────────────────
// Refresh Token Controller
// ──────────────────────────────────────────────────────────
// Access Token মেয়াদ শেষ হলে Refresh Token দিয়ে নতুন Access Token নেওয়া যাবে।
const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  // 1. Zod দিয়ে refresh token দেওয়া হয়েছে কিনা চেক করা হচ্ছে
  const validationResult = refreshTokenValidationSchema.safeParse({ body: req.body });

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: validationResult.error.issues,
    });
    return;
  }

  // 2. AuthService-কে refresh token verify করে নতুন tokens তৈরি করতে বলা হচ্ছে
  const result = await AuthService.refreshAccessToken(req.body);

  // 3. সফলভাবে নতুন token তৈরি হলে ইউজারকে দেওয়া হচ্ছে
  res.status(200).json(
    new ApiResponse(
      200,
      result,
      'Token refreshed successfully.'
    )
  );
});

// ──────────────────────────────────────────────────────────
// Change Password Controller (Protected Route)
// ──────────────────────────────────────────────────────────
// লগইন করা ইউজার পুরনো password দিয়ে নতুন password সেট করতে পারবে। ইউজারকে অবশ্যই JWT দিতে হবে।
const changePassword = asyncHandler(async (req: Request, res: Response) => {
  // 1. Zod দিয়ে oldPassword ও newPassword সঠিকভাবে দেওয়া হয়েছে কিনা চেক করা হচ্ছে
  const validationResult = changePasswordValidationSchema.safeParse({ body: req.body });

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: validationResult.error.issues,
    });
    return;
  }

  // 2. protect middleware থেকে পাওয়া req.user.id দিয়ে AuthService-কে password change করতে বলা হচ্ছে
  const userId = (req as any).user.id;
  const result = await AuthService.changePassword(userId, req.body);

  // 3. সফলভাবে password বদলানো হলে ইউজারকে জানানো হচ্ছে
  res.status(200).json(
    new ApiResponse(
      200,
      result,
      'Password changed successfully.'
    )
  );
});

// ──────────────────────────────────────────────────────────
// Google Login Controller
// ──────────────────────────────────────────────────────────
const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  // 1. Zod দিয়ে idToken চেক করা হচ্ছে
  const validationResult = googleLoginValidationSchema.safeParse({ body: req.body });

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: validationResult.error.issues,
    });
    return;
  }

  // 2. AuthService-কে Google Token দিয়ে যাচাই করতে বলা হচ্ছে
  const result = await AuthService.googleLogin(req.body);

  // 3. সফলভাবে লগইন হলে ইউজারকে তার ডাটা ও JWT Token সহ রেসপন্স দেওয়া হচ্ছে
  res.status(200).json(
    new ApiResponse(
      200,
      result,
      'Google Login successful'
    )
  );
});

export const AuthController = {
  register,
  verifyOtp,
  resendOtp,
  login,
  forgotPassword,
  verifyForgotPasswordOtp,
  resendForgotPasswordOtp,
  resetPassword,           // নতুন: reset password controller
  refreshToken,            // নতুন: refresh token controller
  changePassword,          // নতুন: change password controller (protected)
  googleLogin,             // নতুন: google login controller
};