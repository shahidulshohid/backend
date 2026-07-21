import { PrismaClient, StoryPrivacy } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

// story.service.ts ফাইলটি ইউজারের স্টোরি পোস্ট, দেখা, রিঅ্যাক্ট ও ডিলিটের ডাটাবেজ অপারেশনগুলো সম্পাদন করে।

const prisma = new PrismaClient();

// ১. নতুন স্টোরি পোস্ট করা
const addStory = async (userId: number, payload: { images: string[]; privacy?: StoryPrivacy }) => {
  if (!payload.images || payload.images.length === 0) {
    throw new ApiError(400, 'কমপক্ষে একটি ছবির ইউআরএল দিতে হবে');
  }

  const story = await prisma.story.create({
    data: {
      userId,
      images: payload.images,
      privacy: payload.privacy || StoryPrivacy.PUBLIC,
    },
    include: {
      user: {
        select: { id: true, name: true, profileImage: true },
      },
    },
  });

  return story;
};

// ২. একটি স্টোরি আইডি দিয়ে দেখা
const getSingleStory = async (storyId: number, userId: number) => {
  const story = await prisma.story.findUnique({
    where: { id: storyId },
    include: {
      user: {
        select: { id: true, name: true, profileImage: true },
      },
      _count: {
        select: {
          seenBy: true,
          reactions: true,
        },
      },
    },
  });

  if (!story) {
    throw new ApiError(404, 'স্টোরি পাওয়া যায়নি');
  }

  // ইউজার আগে থেকেই সিন বা রিঅ্যাক্ট করেছে কিনা দেখা
  const [isSeen, isReacted] = await Promise.all([
    prisma.storySeen.findUnique({
      where: {
        storyId_userId: { storyId, userId },
      },
    }),
    prisma.storyReact.findUnique({
      where: {
        storyId_userId: { storyId, userId },
      },
    }),
  ]);

  // যদি ইউজার নিজের না হয় এবং আগে দেখা না হয়ে থাকে, তবে Seen এন্ট্রি যুক্ত করা
  if (!isSeen && story.userId !== userId) {
    await prisma.storySeen.create({
      data: { storyId, userId },
    });
  }

  return {
    ...story,
    isSeen: !!isSeen,
    isReacted: !!isReacted,
  };
};

// ৩. ইউজারের সব স্টোরি লিস্ট (ফিড)
const getStoriesByUser = async (targetUserId: number, currentUserId: number) => {
  const isOwnStories = targetUserId === currentUserId;

  const where: any = {
    userId: targetUserId,
  };

  if (!isOwnStories) {
    where.privacy = StoryPrivacy.PUBLIC;
  }

  const stories = await prisma.story.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, name: true, profileImage: true },
      },
      _count: {
        select: { seenBy: true, reactions: true },
      },
    },
  });

  return stories;
};

// ৪. স্টোরিতে রিঅ্যাক্ট দেওয়া / রিমুভ করা
const toggleReactStory = async (storyId: number, userId: number) => {
  const story = await prisma.story.findUnique({
    where: { id: storyId },
  });

  if (!story) {
    throw new ApiError(404, 'স্টোরি পাওয়া যায়নি');
  }

  const existingReact = await prisma.storyReact.findUnique({
    where: {
      storyId_userId: { storyId, userId },
    },
  });

  if (existingReact) {
    await prisma.storyReact.delete({
      where: { id: existingReact.id },
    });
    return { reacted: false, message: 'রিঅ্যাকশন রিমুভ করা হয়েছে' };
  } else {
    await prisma.storyReact.create({
      data: { storyId, userId },
    });
    return { reacted: true, message: 'রিঅ্যাকশন যুক্ত করা হয়েছে' };
  }
};

// ৫. স্টোরি ডিলিট করা
const deleteStory = async (storyId: number, userId: number) => {
  const story = await prisma.story.findUnique({
    where: { id: storyId },
  });

  if (!story) {
    throw new ApiError(404, 'স্টোরি পাওয়া যায়নি');
  }

  if (story.userId !== userId) {
    throw new ApiError(403, 'নিজের স্টোরি ছাড়া অন্য কারো স্টোরি ডিলিট করা সম্ভব নয়');
  }

  await prisma.story.delete({
    where: { id: storyId },
  });

  return { message: 'স্টোরি সফলভাবে ডিলিট করা হয়েছে' };
};

export const StoryService = {
  addStory,
  getSingleStory,
  getStoriesByUser,
  toggleReactStory,
  deleteStory,
};
