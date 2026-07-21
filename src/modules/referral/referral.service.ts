import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

// referral.service.ts ফাইলটি রেফারাল কোড জেনারেট, ক্লেইম এবং হিস্ট্রি নিয়ন্ত্রণ করে।

const prisma = new PrismaClient();

// ১. ইউজারের নিজস্ব রেফারাল কোড পাওয়া (না থাকলে স্বয়ংক্রিয়ভাবে জেনারেট করা)
const getMyReferralCode = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, referralCode: true, name: true },
  });

  if (!user) {
    throw new ApiError(404, 'ইউজার পাওয়া যায়নি');
  }

  let code = user.referralCode;

  if (!code) {
    // ইউজার আইডি ও র‍্যান্ডম স্ট্রিং মিলিয়ে ৮ অক্ষরের রেফারাল কোড জেনারেট করা
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    code = `REF${userId}${randomPart}`;

    await prisma.user.update({
      where: { id: userId },
      data: { referralCode: code },
    });
  }

  // এই কোড ব্যবহার করে কয়জন ইউজার জয়েন করেছে তার লিস্ট আনা
  const referrals = await prisma.referral.findMany({
    where: { referrerId: userId },
    orderBy: { createdAt: 'desc' },
  });

  return {
    referralCode: code,
    totalReferrals: referrals.length,
    referrals,
  };
};

// ২. রেফারাল কোড ক্লেইম / ব্যবহার করা
const claimReferralCode = async (refereeId: number, referralCode: string) => {
  const referrer = await prisma.user.findFirst({
    where: { referralCode },
  });

  if (!referrer) {
    throw new ApiError(400, 'অকার্যকর (Invalid) রেফারাল কোড');
  }

  if (referrer.id === refereeId) {
    throw new ApiError(400, 'নিজের রেফারাল কোড নিজে ব্যবহার করা যাবে না');
  }

  const existingClaim = await prisma.referral.findFirst({
    where: { refereeId },
  });

  if (existingClaim) {
    throw new ApiError(400, 'আপনি ইতিমধ্যে একটি রেফারাল কোড ব্যবহার করেছেন');
  }

  const referral = await prisma.referral.create({
    data: {
      referrerId: referrer.id,
      refereeId,
      code: referralCode,
      rewardAmount: 5, // €5 রিওয়ার্ড বোনাস
      status: 'COMPLETED',
    },
  });

  return referral;
};

export const ReferralService = {
  getMyReferralCode,
  claimReferralCode,
};
