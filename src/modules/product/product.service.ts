import { PrismaClient, ProductStatus } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

// product.service.ts ফাইলটি ই-কমার্স প্রডাক্ট তৈরি, এডিট, ফিল্টারিং ও সার্চিং পরিচালনা করে।

const prisma = new PrismaClient();

// ১. নতুন প্রডাক্ট যোগ করা (Admin / Super Admin)
const createProduct = async (adminId: number, payload: {
  name: string;
  description: string;
  regularPrice: number;
  discountPercentage?: number;
  weight?: number;
  categoryId: number;
  isFeatured?: boolean;
  status?: ProductStatus;
  images?: string[];
  tags?: string[];
  sizes?: string[];
}) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    throw new ApiError(400, 'ক্যাটাগরি পাওয়া যায়নি');
  }

  const discountPercentage = payload.discountPercentage || 0;
  const finalPrice = payload.regularPrice - (payload.regularPrice * discountPercentage) / 100;

  const product = await prisma.product.create({
    data: {
      name: payload.name,
      description: payload.description,
      regularPrice: payload.regularPrice,
      discountPercentage,
      finalPrice,
      weight: payload.weight,
      categoryId: payload.categoryId,
      isFeatured: payload.isFeatured || false,
      status: payload.status || ProductStatus.ACTIVE,
      createdBy: adminId,
      images: payload.images
        ? { create: payload.images.map((url, idx) => ({ imageUrl: url, isPrimary: idx === 0 })) }
        : undefined,
      tags: payload.tags
        ? { create: payload.tags.map((tag) => ({ tag })) }
        : undefined,
      sizes: payload.sizes
        ? { create: payload.sizes.map((size) => ({ size })) }
        : undefined,
    },
    include: {
      category: true,
      images: true,
      tags: true,
      sizes: true,
    },
  });

  return product;
};

// ২. সব প্রডাক্ট ফিল্টারিং ও পেজিনেশন সহ আনা (Public)
const getAllProducts = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: any = {
    status: ProductStatus.ACTIVE,
  };

  if (query.searchTerm) {
    where.OR = [
      { name: { contains: query.searchTerm, mode: 'insensitive' } },
      { description: { contains: query.searchTerm, mode: 'insensitive' } },
    ];
  }

  if (query.categoryId) {
    where.categoryId = Number(query.categoryId);
  }

  if (query.isFeatured) {
    where.isFeatured = query.isFeatured === 'true';
  }

  const products = await prisma.product.findMany({
    where,
    skip,
    take: limit,
    include: {
      category: true,
      images: true,
      tags: true,
      sizes: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.product.count({ where });

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data: products,
  };
};

// ৩. একটি নির্দিষ্ট প্রডাক্ট দেখা
const getSingleProduct = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
      tags: true,
      sizes: true,
    },
  });

  if (!product) {
    throw new ApiError(404, 'প্রডাক্ট পাওয়া যায়নি');
  }

  return product;
};

// ৪. প্রডাক্ট আপডেট করা (Admin)
const updateProduct = async (id: number, payload: any) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(404, 'প্রডাক্ট পাওয়া যায়নি');
  }

  let finalPrice = existing.finalPrice;
  const regPrice = payload.regularPrice !== undefined ? payload.regularPrice : existing.regularPrice;
  const disc = payload.discountPercentage !== undefined ? payload.discountPercentage : existing.discountPercentage;
  finalPrice = regPrice - (regPrice * disc) / 100;

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...payload,
      finalPrice,
    },
    include: {
      category: true,
      images: true,
      tags: true,
      sizes: true,
    },
  });

  return updated;
};

// ৫. প্রডাক্ট ডিলিট করা (Super Admin)
const deleteProduct = async (id: number) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(404, 'প্রডাক্ট পাওয়া যায়নি');
  }

  await prisma.product.delete({ where: { id } });
  return { message: 'প্রডাক্ট সফলভাবে মুছে ফেলা হয়েছে' };
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
