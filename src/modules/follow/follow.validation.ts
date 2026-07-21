import { z } from 'zod';

// ফলো / আনফলো সম্পর্কিত ভ্যালিডেশন
export const followUserValidation = z.object({
  params: z.object({
    userId: z.string({
      message: 'ফলো করার জন্য ইউজার আইডি আবশ্যক',
    }),
  }),
});
