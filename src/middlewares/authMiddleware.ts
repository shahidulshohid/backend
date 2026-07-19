import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

// authMiddleware.ts ফাইলটি Protected Route গুলো রক্ষা করার কাজ করে।
// যখন কোনো Route-এ এই middleware ব্যবহার করা হবে, তখন ইউজারকে অবশ্যই
// valid JWT Access Token দিতে হবে। না হলে সে সেই API ব্যবহার করতে পারবে না।

const prisma = new PrismaClient();

// Express এর Request টাইপ এক্সটেন্ড করে user ফিল্ড যোগ করা হচ্ছে।
// এটি না করলে TypeScript এরর দেবে যখন আমরা req.user লিখব।
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string | null;
        email: string;
        role: string;
      };
    }
  }
}

const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Request এর Header থেকে Authorization Token নেওয়া হচ্ছে
    // ফরম্যাট: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'No token provided. Unauthorized.' });
      return;
    }

    // 2. "Bearer <token>" থেকে শুধু token অংশটি বের করা হচ্ছে
    const token = authHeader.split(' ')[1];

    // 3. JWT দিয়ে token টি verify করা হচ্ছে — যদি মেয়াদ শেষ বা ভুল token হয়, তবে error আসবে
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123') as { id: number };

    // 4. Decoded token থেকে user id ব্যবহার করে database থেকে user এর তথ্য আনা হচ্ছে
    // এখানে role ফিল্ডটি ও সিলেক্ট করা হচ্ছে যাতে অ্যাডমিন চেক মিডলওয়্যারে এটি ব্যবহার করা যায়
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true }, // পাসওয়ার্ড বাদ দিয়ে শুধু দরকারী তথ্য আনছি
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found. Token invalid.' });
      return;
    }

    // 5. ইউজারের তথ্য req.user-এ রাখা হচ্ছে যাতে পরবর্তী Controller থেকে এটি ব্যবহার করা যায়
    req.user = user;

    // 6. সব ঠিক থাকলে পরবর্তী middleware বা controller-এ যাওয়ার অনুমতি দেওয়া হচ্ছে
    next();

  } catch (error) {
    // Token invalid বা মেয়াদ শেষ হলে এই error আসবে
    res.status(401).json({ success: false, message: 'Token invalid or expired.' });
  }
};

export default protect;
