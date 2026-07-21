import { PrismaClient, NotificationType } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

// follow.service.ts ফাইলটি ফলো, আনফলো এবং ফলোয়ার্স/ফলোয়িং তথ্য ডাটাবেজে হ্যান্ডেল করে।

const prisma = new PrismaClient();

// ১. কোনো ইউজারকে ফলো করা
const followUser = async (followerId: number, followedId: number) => {
  if (followerId === followedId) {
    throw new ApiError(400, 'নিজের অ্যাকাউন্ট নিজেকে ফলো করা যাবে না');
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: followedId },
  });

  if (!targetUser) {
    throw new ApiError(404, 'ইউজার পাওয়া যায়নি');
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followedId: { followerId, followedId },
    },
  });

  if (existingFollow) {
    throw new ApiError(400, 'আপনি ইতিমধ্যে এই ইউজারকে ফলো করছেন');
  }

  const follow = await prisma.follow.create({
    data: { followerId, followedId },
  });

  // ফলো করা হলে যাকে ফলো করা হলো তার কাছে একটি নোটিফিকেশন পাঠানো
  const followerUser = await prisma.user.findUnique({ where: { id: followerId } });
  await prisma.notification.create({
    data: {
      senderId: followerId,
      receiverId: followedId,
      type: NotificationType.FOLLOW,
      title: 'নতুন ফলোয়ার',
      message: `${followerUser?.name || 'একজন ইউজার'} আপনাকে ফলো করতে শুরু করেছেন`,
    },
  });

  return follow;
};

// ২. কোনো ইউজারকে আনফলো করা
const unfollowUser = async (followerId: number, followedId: number) => {
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followedId: { followerId, followedId },
    },
  });

  if (!existingFollow) {
    throw new ApiError(400, 'আপনি এই ইউজারকে ফলো করছেন না');
  }

  await prisma.follow.delete({
    where: { id: existingFollow.id },
  });

  return { message: 'সফলভাবে আনফলো করা হয়েছে' };
};

// ৩. কারো ফলোয়ার্স (Followers) লিস্ট দেখা
const getFollowers = async (userId: number) => {
  const followers = await prisma.follow.findMany({
    where: { followedId: userId },
    include: {
      follower: {
        select: { id: true, name: true, profileImage: true, role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return followers.map((f) => f.follower);
};

// ৪. কারো ফলোয়িং (Following) লিস্ট দেখা
const getFollowing = async (userId: number) => {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      followed: {
        select: { id: true, name: true, profileImage: true, role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return following.map((f) => f.followed);
};

export const FollowService = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};
