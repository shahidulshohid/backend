import { z } from 'zod';

// ইউজার ব্লক করার ভ্যালিডেশন
export const blockUserValidation = z.object({
  body: z.object({
    blockedId: z.number({
      message: 'যাকে ব্লক করতে চান তার আইডি আবশ্যক',
    }),
    reason: z.string().optional(),
  }),
});

// ইউজার আনব্লক করার ভ্যালিডেশন
export const unblockUserValidation = z.object({
  body: z.object({
    blockedId: z.number({
      message: 'যাকে আনব্লক করতে চান তার আইডি আবশ্যক',
    }),
  }),
});
