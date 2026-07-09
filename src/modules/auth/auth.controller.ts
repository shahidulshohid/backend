import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { registerValidationSchema } from './auth.validation';

// auth.controller.ts ফাইলটির কাজ হলো ইউজারের রিকোয়েস্ট (Request) রিসিভ করা এবং রেসপন্স (Response) দেওয়া।
// এখানে কোনো ডাটাবেজ লজিক থাকে না, ডাটাবেজের কাজগুলো AuthService করে থাকে।

const register = asyncHandler(async (req: Request, res: Response) => {
  // 1. Zod দিয়ে ইউজার সঠিক ডাটা দিয়েছে কিনা তা চেক করা হচ্ছে
  const validationResult = registerValidationSchema.safeParse({ body: req.body });
  
  if (!validationResult.success) {
    // যদি ডাটা ভুল হয় (যেমন- ইমেইল ফরম্যাট ভুল বা পাসওয়ার্ড ছোট), তবে এরর রেসপন্স দেওয়া হবে
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

export const AuthController = {
  register,
};