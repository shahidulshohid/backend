import { z } from 'zod';

// কল ইনিশিয়েট করার ভ্যালিডেশন
export const initiateCallValidation = z.object({
  body: z.object({
    receiverId: z.number({ message: 'যাকে কল করতে চান তার আইডি আবশ্যক' }),
  }),
});

// কল শেষ করার ভ্যালিডেশন
export const endCallValidation = z.object({
  body: z.object({
    duration: z.number().min(0, 'ডিউরেশন প্রদান করুন'),
  }),
});
