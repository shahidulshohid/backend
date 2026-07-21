import { z } from 'zod';

// নোটিফিকেশন ভ্যালিডেশন
export const markNotificationReadValidation = z.object({
  params: z.object({
    id: z.string({
      message: 'নোটিফিকেশন আইডি আবশ্যক',
    }),
  }),
});
