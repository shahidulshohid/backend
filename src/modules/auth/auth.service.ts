import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../../utils/email';
import { ApiError } from '../../utils/apiError';
import { generateTokens } from '../../utils/jwt';

// auth.service.ts ফাইলটি মূলত ডাটাবেজের সাথে যোগাযোগ করার কাজ করে।
// Controller থেকে ডাটা এখানে আসে, এরপর Service ডাটাবেজে ডাটা সেভ বা চেক করে রেজাল্ট ফেরত দেয়।

const prisma = new PrismaClient();

// ──────────────────────────────────────────────────────────
// Register User Service
// ──────────────────────────────────────────────────────────
const registerUser = async (payload: any) => {
  const { name, email, password } = payload;

  // 1. চেক করছি ইউজার আগে থেকেই ডাটাবেজে আছে কিনা
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (user && user.isVerified) {
    throw new ApiError(400, 'Email already registered and verified');
  }

  // 2. ৬ ডিজিটের একটি র‍্যান্ডম OTP তৈরি করা হচ্ছে
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP ১০ মিনিটের জন্য ভ্যালিড থাকবে

  // 3. ইউজারের পাসওয়ার্ডটি নিরাপদ রাখার জন্য bcrypt দিয়ে হ্যাশ (Hash) করা হচ্ছে
  const hashedPassword = await bcrypt.hash(password, 10);

  if (user && !user.isVerified) {
    // যদি ইউজার আগে রেজিস্টার করে থাকে কিন্তু ইমেইল ভেরিফাই না করে থাকে, তাহলে ডাটা আপডেট করে দেব
    user = await prisma.user.update({
      where: { email },
      data: { name, password: hashedPassword, otp, otpExpiry }
    });
  } else {
    // নতুন ইউজার হলে ডাটাবেজে সেভ করব
    user = await prisma.user.create({
      data: { name, email, password: hashedPassword, otp, otpExpiry },
    });
  }

  // 4. ইউজারের ইমেইলে OTP পাঠানো হচ্ছে
  await sendOtpEmail(email, otp);

  // 5. রেসপন্সের জন্য ইউজারের কিছু ডাটা রিটার্ন করা হচ্ছে
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
};

// ──────────────────────────────────────────────────────────
// Login User Service
// ──────────────────────────────────────────────────────────
const loginUser = async (payload: any) => {
  const { email, password } = payload;

  // 1. ইউজার ডাটাবেজে আছে কিনা চেক করছি
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // ইউজার না থাকলে এরর দেব — নিরাপত্তার জন্য "User not found" না বলে "Invalid credentials" বলব
    throw new ApiError(401, 'Invalid email or password');
  }

  // 2. ইউজার ইমেইল ভেরিফাই করেছে কিনা চেক করছি
  if (!user.isVerified) {
    throw new ApiError(403, 'Email not verified. Please verify your email first.');
  }

  // 3. ইউজারের দেওয়া পাসওয়ার্ড ডাটাবেজের হ্যাশড পাসওয়ার্ডের সাথে মিলছে কিনা চেক করছি
  const isPasswordMatch = await bcrypt.compare(password, user.password || '');

  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // 4. পাসওয়ার্ড সঠিক হলে JWT Access Token এবং Refresh Token জেনারেট করছি
  const { accessToken, refreshToken } = generateTokens(user.id);

  // 5. রেসপন্সের জন্য ইউজারের ডাটা এবং টোকেন রিটার্ন করছি (পাসওয়ার্ড বাদ দিয়ে)
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

// ──────────────────────────────────────────────────────────
// Verify OTP Service (রেজিস্ট্রেশনের পর OTP যাচাই করার জন্য)
// ──────────────────────────────────────────────────────────
const verifyOtpUser = async (payload: any) => {
  const { email, otp } = payload;

  // 1. ইউজার ডাটাবেজে আছে কিনা চেক করছি
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // 2. ইউজার আগেই ভেরিফাইড কিনা চেক করছি
  if (user.isVerified) {
    throw new ApiError(400, 'User already verified');
  }

  // 3. ইউজারের দেওয়া OTP ডাটাবেজের OTP এর সাথে মিলছে কিনা চেক করছি
  if (user.otp !== String(otp).trim()) {
    throw new ApiError(400, 'Invalid OTP');
  }

  // 4. OTP এর মেয়াদ শেষ হয়ে গেছে কিনা চেক করছি
  if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
    throw new ApiError(400, 'OTP has expired. Please request a new one.');
  }

  // 5. সব ঠিকঠাক থাকলে ইউজারকে verified করে দিচ্ছি এবং OTP মুছে দিচ্ছি
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      isVerified: true,
      otp: null,
      otpExpiry: null,
    },
  });

  // 6. ভেরিফিকেশন সফল হলে JWT Token জেনারেট করে দিচ্ছি যাতে ইউজার সরাসরি লগইন হয়ে যায়
  const { accessToken, refreshToken } = generateTokens(updatedUser.id);

  return {
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    },
    accessToken,
    refreshToken,
  };
};

// ──────────────────────────────────────────────────────────
// Resend OTP Service (রেজিস্ট্রেশনের জন্য নতুন OTP পাঠানো)
// ──────────────────────────────────────────────────────────
const resendOtpUser = async (payload: any) => {
  const { email } = payload;

  // 1. ইউজার ডাটাবেজে আছে কিনা চেক করছি
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(404, 'User not found. Please register first.');
  }

  // 2. ইউজার ইতোমধ্যে ভেরিফাইড হলে আর OTP দরকার নেই
  if (user.isVerified) {
    throw new ApiError(400, 'Email is already verified.');
  }

  // 3. নতুন ৬ ডিজিটের OTP তৈরি করছি
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // নতুন OTP ১০ মিনিটের জন্য ভ্যালিড

  // 4. ডাটাবেজে নতুন OTP আপডেট করছি
  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiry },
  });

  // 5. ইউজারের ইমেইলে নতুন OTP পাঠাচ্ছি
  await sendOtpEmail(email, otp);

  return {
    message: 'A new OTP has been sent to your email.',
  };
};

// ──────────────────────────────────────────────────────────
// Forgot Password Service
// ──────────────────────────────────────────────────────────
// ইউজার পাসওয়ার্ড ভুলে গেলে তার ইমেইলে একটি OTP পাঠানো হবে।
const forgotPassword = async (payload: any) => {
  const { email } = payload;

  // 1. ইউজার ডাটাবেজে আছে কিনা চেক করছি
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(404, 'No account found with this email address.');
  }

  // 2. নতুন ৬ ডিজিটের OTP তৈরি করছি
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP ১০ মিনিটের জন্য ভ্যালিড

  // 3. ডাটাবেজে OTP আপডেট করছি
  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiry },
  });

  // 4. ইউজারের ইমেইলে OTP পাঠাচ্ছি
  await sendOtpEmail(email, otp);

  return {
    message: 'Password reset OTP sent to your email.',
  };
};

// ──────────────────────────────────────────────────────────
// Verify Forgot Password OTP Service
// ──────────────────────────────────────────────────────────
// Forgot password OTP টি সঠিক কিনা যাচাই করা হবে। সঠিক হলে reset করার permission দেওয়া হবে।
const verifyForgotPasswordOtp = async (payload: any) => {
  const { email, otp } = payload;

  // 1. ইউজার ডাটাবেজে আছে কিনা চেক করছি
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  // 2. OTP মিলছে কিনা চেক করছি
  if (user.otp !== String(otp).trim()) {
    throw new ApiError(400, 'Invalid OTP.');
  }

  // 3. OTP এর মেয়াদ শেষ হয়নি তো চেক করছি
  if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
    throw new ApiError(400, 'OTP has expired. Please request a new one.');
  }

  // 4. OTP সঠিক হলে শুধু success মেসেজ দেব — password reset পরের ধাপে হবে
  return {
    message: 'OTP verified successfully. You can now reset your password.',
  };
};

// ──────────────────────────────────────────────────────────
// Resend Forgot Password OTP Service
// ──────────────────────────────────────────────────────────
// Forgot password OTP expire হলে নতুন OTP পাঠানো হবে।
const resendForgotPasswordOtp = async (payload: any) => {
  const { email } = payload;

  // 1. ইউজার ডাটাবেজে আছে কিনা চেক করছি
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(404, 'No account found with this email address.');
  }

  // 2. নতুন ৬ ডিজিটের OTP তৈরি করছি
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // নতুন OTP ১০ মিনিটের জন্য ভ্যালিড

  // 3. ডাটাবেজে নতুন OTP আপডেট করছি
  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiry },
  });

  // 4. ইউজারের ইমেইলে নতুন OTP পাঠাচ্ছি
  await sendOtpEmail(email, otp);

  return {
    message: 'A new password reset OTP has been sent to your email.',
  };
};

// ──────────────────────────────────────────────────────────
// Reset Password Service
// ──────────────────────────────────────────────────────────
// OTP verify করার পর ইউজার নতুন পাসওয়ার্ড সেট করতে পারবে।
const resetPassword = async (payload: any) => {
  const { email, otp, newPassword } = payload;

  // 1. ইউজার ডাটাবেজে আছে কিনা চেক করছি
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  // 2. OTP মিলছে কিনা চেক করছি
  if (user.otp !== String(otp).trim()) {
    throw new ApiError(400, 'Invalid OTP.');
  }

  // 3. OTP এর মেয়াদ শেষ হয়নি তো চেক করছি
  if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
    throw new ApiError(400, 'OTP has expired. Please request a new one.');
  }

  // 4. নতুন পাসওয়ার্ড bcrypt দিয়ে hash করছি
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // 5. নতুন পাসওয়ার্ড সেট করছি এবং OTP মুছে দিচ্ছি
  await prisma.user.update({
    where: { email },
    data: {
      password: hashedNewPassword,
      otp: null,
      otpExpiry: null,
    },
  });

  return {
    message: 'Password reset successful. Please login with your new password.',
  };
};

// ──────────────────────────────────────────────────────────
// Refresh Token Service
// ──────────────────────────────────────────────────────────
// Access Token মেয়াদ শেষ হলে Refresh Token দিয়ে নতুন Access Token নেওয়া যাবে।
const refreshAccessToken = async (payload: any) => {
  const { token } = payload;

  // 1. Refresh Token টি verify করা হচ্ছে
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refreshSecret123');
  } catch {
    throw new ApiError(403, 'Invalid or expired refresh token.');
  }

  // 2. Decoded token থেকে user id দিয়ে ডাটাবেজে ইউজার খোঁজা হচ্ছে
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!user) {
    throw new ApiError(403, 'Invalid refresh token. User not found.');
  }

  // 3. সব ঠিকঠাক থাকলে নতুন Access Token ও Refresh Token জেনারেট করে রিটার্ন করছি
  const tokens = generateTokens(user.id);

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

// ──────────────────────────────────────────────────────────
// Change Password Service (Protected — login করা ইউজারের জন্য)
// ──────────────────────────────────────────────────────────
// লগইন করা ইউজার তার পুরনো পাসওয়ার্ড দিয়ে নতুন পাসওয়ার্ড পরিবর্তন করতে পারবে।
const changePassword = async (userId: number, payload: any) => {
  const { oldPassword, newPassword } = payload;

  // 1. ইউজার ডাটাবেজে আছে কিনা চেক করছি
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  // 2. পুরনো পাসওয়ার্ড সঠিক কিনা চেক করছি
  const isMatch = await bcrypt.compare(oldPassword, user.password || '');

  if (!isMatch) {
    throw new ApiError(400, 'Incorrect old password.');
  }

  // 3. নতুন পাসওয়ার্ড bcrypt দিয়ে hash করছি
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // 4. ডাটাবেজে নতুন পাসওয়ার্ড আপডেট করছি
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  return {
    message: 'Password changed successfully.',
  };
};

export const AuthService = {
  registerUser,
  loginUser,
  verifyOtpUser,
  resendOtpUser,
  forgotPassword,
  verifyForgotPasswordOtp,
  resendForgotPasswordOtp,
  resetPassword,           // নতুন: reset password service
  refreshAccessToken,      // নতুন: refresh token service
  changePassword,          // নতুন: change password service (protected)
};