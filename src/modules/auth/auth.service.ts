import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '../../utils/email';
import { ApiError } from '../../utils/apiError';

// auth.service.ts ফাইলটি মূলত ডাটাবেজের সাথে যোগাযোগ করার কাজ করে।
// Controller থেকে ডাটা এখানে আসে, এরপর Service ডাটাবেজে ডাটা সেভ বা চেক করে রেজাল্ট ফেরত দেয়।

const prisma = new PrismaClient();

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

export const AuthService = {
  registerUser,
};