import { z } from 'zod';

// ম্যানুয়াল লেনদেন করার ভ্যালিডেশন
export const createManualTransactionValidation = z.object({
  body: z.object({
    userId: z.number({ message: 'ইউজার আইডি আবশ্যক' }),
    amount: z.number().min(1, 'পরিমাণ কমপক্ষে ১ হতে হবে'),
    type: z.enum(['REFERRAL_REWARD', 'WITHDRAWAL', 'PAYMENT', 'REFUND', 'TOPUP', 'PAYOUT', 'PLATFORM_FEE', 'CALL_SESSION', 'LIVE_SESSION', 'GIFT']),
    description: z.string().min(1, 'বিবরণ দেওয়া আবশ্যক'),
  }),
});
