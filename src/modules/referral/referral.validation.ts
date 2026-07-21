import { z } from 'zod';

// রেফারাল কোড ক্লেইম ভ্যালিডেশন
export const claimReferralValidation = z.object({
  body: z.object({
    referralCode: z.string({
      message: 'রেফারাল কোড আবশ্যক',
    }),
  }),
});
