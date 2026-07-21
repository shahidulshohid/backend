import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

// validateRequest.ts ফাইলটি Zod স্কিমা অনুযায়ী ইউজারের পাঠানো ডাটা (body, query, params) পরীক্ষা করে।

const validateRequest = (schema: ZodType<any>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error?.errors?.[0]?.message || error.message || 'ভ্যালিডেশন এরর',
        errors: error?.errors || [],
      });
    }
  };
};

export default validateRequest;
