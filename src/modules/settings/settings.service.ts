import { PrismaClient } from '@prisma/client';

// settings.service.ts ফাইলটি সেশন সেটিংস এবং প্ল্যাটফর্ম রেভিনিউ শেয়ার সেটিংস পরিচালনা করে।

const prisma = new PrismaClient();

// ১. সেশন সেটিংস দেখা (না থাকলে ডিফল্ট সেটিংস তৈরি করা হবে)
const getSessionSettings = async () => {
  let settings = await prisma.sessionSettings.findFirst();

  if (!settings) {
    settings = await prisma.sessionSettings.create({
      data: {
        minimumCallMinutes: 5,
        liveCommentYesNoCost: 5,
        liveCommentDetailedCost: 10,
        psychologistPercentage: 70,
        adminPercentage: 30,
        payoutReleaseDay: 1,
      },
    });
  }

  return settings;
};

// ২. সেশন সেটিংস আপডেট করা (Admin / Super Admin)
const updateSessionSettings = async (data: any) => {
  const existingSettings = await prisma.sessionSettings.findFirst();

  if (!existingSettings) {
    return await prisma.sessionSettings.create({
      data,
    });
  }

  return await prisma.sessionSettings.update({
    where: { id: existingSettings.id },
    data,
  });
};

// ৩. পেআউট রিলিজের দিন পাওয়া
const getPayoutReleaseDay = async () => {
  const settings = await getSessionSettings();
  return { payoutReleaseDay: settings.payoutReleaseDay };
};

export const SettingsService = {
  getSessionSettings,
  updateSessionSettings,
  getPayoutReleaseDay,
};
