import { PrismaClient, CategoryType, CategoryStatus } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

// category.service.ts ফাইলটি ক্যাটাগরি সংক্রান্ত ডাটাবেজ অপারেশনগুলো সম্পাদন করে।

const prisma = new PrismaClient();

// ক্যাটাগরি ক্রিয়েট করার জন্য ইনপুট ইন্টারফেস
interface ICreateCategoryRequest {
  name: string;
  type: CategoryType;
  image?: string;
  status?: CategoryStatus;
}

// ক্যাটাগরি আপডেট করার জন্য ইনপুট ইন্টারফেস
interface IUpdateCategoryRequest {
  name?: string;
  type?: CategoryType;
  image?: string;
  status?: CategoryStatus;
}

// ক্যাটাগরি ফিল্টার করার ইনপুট ইন্টারফেস
interface ICategoryFilterRequest {
  searchTerm?: string;
  type?: CategoryType;
  status?: CategoryStatus;
}

// সিলেক্ট অবজেক্ট
const categorySelect = {
  id: true,
  name: true,
  type: true,
  image: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

// ১. নতুন ক্যাটাগরি তৈরি করা
const createCategory = async (payload: ICreateCategoryRequest) => {
  // ক্যাটাগরির নাম ইতিমধ্যে ডাটাবেজে আছে কিনা চেক করা
  const existingCategory = await prisma.category.findUnique({
    where: { name: payload.name },
  });

  if (existingCategory) {
    throw new ApiError(400, 'এই নামের ক্যাটাগরি ইতিমধ্যে বিদ্যমান রয়েছে');
  }

  // SERVICE টাইপের ক্যাটাগরির জন্য ছবি দেওয়া বাধ্যতামূলক
  if (payload.type === CategoryType.SERVICE && !payload.image) {
    throw new ApiError(400, 'SERVICE ক্যাটাগরির জন্য ছবি প্রদান করা আবশ্যক');
  }

  // PRODUCT টাইপের ক্যাটাগরিতে ছবি প্রযোজ্য নয়
  if (payload.type === CategoryType.PRODUCT && payload.image) {
    throw new ApiError(400, 'PRODUCT ক্যাটাগরির জন্য ছবি প্রযোজ্য নয়');
  }

  const category = await prisma.category.create({
    data: {
      name: payload.name,
      type: payload.type,
      image: payload.image,
      status: payload.status || CategoryStatus.ACTIVE,
    },
    select: categorySelect,
  });

  return category;
};

// ২. ক্যাটাগরি আপডেট করা
const updateCategory = async (id: number, payload: IUpdateCategoryRequest) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new ApiError(404, 'ক্যাটাগরি পাওয়া যায়নি');
  }

  // নাম পরিবর্তন করলে কনফ্লিক্ট চেক করা
  if (payload.name && payload.name !== existingCategory.name) {
    const nameConflict = await prisma.category.findUnique({
      where: { name: payload.name },
    });

    if (nameConflict) {
      throw new ApiError(400, 'এই নামের ক্যাটাগরি ইতিমধ্যে বিদ্যমান রয়েছে');
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: payload,
    select: categorySelect,
  });

  return updatedCategory;
};

// ৩. আইডি দিয়ে একটি ক্যাটাগরি খুঁজে বের করা
const getCategoryById = async (id: number) => {
  const category = await prisma.category.findUnique({
    where: { id },
    select: categorySelect,
  });

  if (!category) {
    throw new ApiError(404, 'ক্যাটাগরি পাওয়া যায়নি');
  }

  return category;
};

// ৪. সমস্ত ক্যাটাগরি ফিল্টারিং ও পেজিনেশন সহ পাওয়া
const getAllCategories = async (
  query: ICategoryFilterRequest & { page?: string; limit?: string }
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (query.searchTerm) {
    where.name = {
      contains: query.searchTerm,
      mode: 'insensitive',
    };
  }

  if (query.type) {
    where.type = query.type;
  }

  if (query.status) {
    where.status = query.status;
  }

  const categories = await prisma.category.findMany({
    where,
    select: categorySelect,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.category.count({ where });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: categories,
  };
};

// ৫. ক্যাটাগরি মুছে ফেলা
const deleteCategory = async (id: number) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new ApiError(404, 'ক্যাটাগরি পাওয়া যায়নি');
  }

  await prisma.category.delete({
    where: { id },
  });

  return { message: 'ক্যাটাগরি সফলভাবে মুছে ফেলা হয়েছে' };
};

export const CategoryService = {
  createCategory,
  updateCategory,
  getCategoryById,
  getAllCategories,
  deleteCategory,
};
