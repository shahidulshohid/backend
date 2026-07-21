import { z } from 'zod';

// সেশন সেটিংস আপডেট করার ভ্যালিডেশন
export const updateSessionSettingsValidation = z.object({
  body: z.object({
    minimumCallMinutes: z.number().min(1).optional(),
    liveCommentYesNoCost: z.number().min(0).optional(),
    liveCommentDetailedCost: z.number().min(0).optional(),
    psychologistPercentage: z.number().min(0).max(100).optional(),
    adminPercentage: z.number().min(0).max(100).optional(),
    payoutReleaseDay: z.number().min(1).max(31).optional(),
  }),
});
