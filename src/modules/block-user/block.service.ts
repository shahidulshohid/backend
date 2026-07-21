import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

// block.service.ts ফাইলটি অন্য ইউজারকে ব্লক করা, আনব্লক করা এবং ব্লকড লিস্ট ম্যানেজ করে।

const prisma = new PrismaClient();

// ১. কোনো ইউজারকে ব্লক করা
const blockUser = async (blockerId: number, blockedId: number, reason?: string) => {
  if (blockerId === blockedId) {
    throw new ApiError(400, 'নিজের অ্যাকাউন্ট নিজেকে ব্লক করা যাবে না');
  }

  // যাকে ব্লক করা হচ্ছে সে সিস্টেমে আছে কিনা দেখা
  const targetUser = await prisma.user.findUnique({
    where: { id: blockedId },
  });

  if (!targetUser) {
    throw new ApiError(404, 'ইউজার পাওয়া যায়নি');
  }

  // ইতিমধ্যে ব্লক করা আছে কিনা দেখা
  const existingBlock = await prisma.blockedUser.findUnique({
    where: {
      blockerId_blockedId: { blockerId, blockedId },
    },
  });

  if (existingBlock) {
    throw new ApiError(400, 'ইউজার ইতিমধ্যে ব্লক করা রয়েছে');
  }

  const result = await prisma.blockedUser.create({
    data: {
      blockerId,
      blockedId,
      reason,
    },
    include: {
      blockedUser: {
        select: { id: true, name: true, profileImage: true },
      },
    },
  });

  return result;
};

// ২. কোনো ইউজারকে আনব্লক করা
const unblockUser = async (blockerId: number, blockedId: number) => {
  const existingBlock = await prisma.blockedUser.findUnique({
    where: {
      blockerId_blockedId: { blockerId, blockedId },
    },
  });

  if (!existingBlock) {
    throw new ApiError(400, 'এই ইউজারটি আপনার ব্লক লিস্টে নেই');
  }

  await prisma.blockedUser.delete({
    where: { id: existingBlock.id },
  });

  return { message: 'ইউজারকে সফলভাবে আনব্লক করা হয়েছে' };
};

// ৩. আমার ব্লক করা ইউজারদের তালিকা দেখা
const getMyBlockedUsers = async (blockerId: number) => {
  const blockedList = await prisma.blockedUser.findMany({
    where: { blockerId },
    include: {
      blockedUser: {
        select: { id: true, name: true, profileImage: true, role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return blockedList;
};

export const BlockService = {
  blockUser,
  unblockUser,
  getMyBlockedUsers,
};
