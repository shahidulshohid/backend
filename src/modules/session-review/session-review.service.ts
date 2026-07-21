import { PrismaClient, ReviewType } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

// session-review.service.ts ফাইলটি সেশন/সাইকোলজিস্টের ফিডব্যাক ও রেটিং পরিচালনা করে।

const prisma = new PrismaClient();

// ১. সাইকোলজিস্টের জন্য রিভিউ প্রদান করা
const createSessionReview = async (userId: number, payload: {
  sessionId?: number;
  psychicId: number;
  rating: number;
  comment?: string;
}) => {
  const psychic = await prisma.user.findUnique({ where: { id: payload.psychicId } });

  if (!psychic) {
    throw new ApiError(404, 'সাইকোলজিস্ট পাওয়া যায়নি');
  }

  const review = await prisma.review.create({
    data: {
      userId,
      psychicId: payload.psychicId,
      sessionId: payload.sessionId,
      rating: payload.rating,
      comment: payload.comment,
      type: ReviewType.CALL_SESSION,
    },
    include: {
      user: { select: { id: true, name: true, profileImage: true } },
    },
  });

  return review;
};

// ২. নির্দিষ্ট সাইকোলজিস্টের সব রিভিউ পড়া
const getPsychicReviews = async (psychicId: number) => {
  const reviews = await prisma.review.findMany({
    where: { psychicId, type: ReviewType.CALL_SESSION },
    include: {
      user: { select: { id: true, name: true, profileImage: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const aggregate = await prisma.review.aggregate({
    where: { psychicId, type: ReviewType.CALL_SESSION },
    _avg: { rating: true },
    _count: { id: true },
  });

  return {
    averageRating: aggregate._avg.rating || 0,
    totalReviews: aggregate._count.id,
    reviews,
  };
};

export const SessionReviewService = {
  createSessionReview,
  getPsychicReviews,
};
