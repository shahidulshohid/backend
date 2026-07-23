import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import categoryRoutes from '../modules/category/category.routes';
import contentRoutes from '../modules/content/content.routes';
import settingsRoutes from '../modules/settings/settings.routes';
import storyRoutes from '../modules/story/story.routes';
import blockRoutes from '../modules/block-user/block.routes';
import followRoutes from '../modules/follow/follow.routes';
import notificationRoutes from '../modules/notification/notification.routes';
import referralRoutes from '../modules/referral/referral.routes';
import walletRoutes from '../modules/wallet/wallet.routes';
import paymentRoutes from '../modules/payment/payment.routes';
import productRoutes from '../modules/product/product.routes';
import cartRoutes from '../modules/cart/cart.routes';
import shippingAddressRoutes from '../modules/shipping-address/shipping-address.routes';
import orderRoutes from '../modules/order/order.routes';
import callRoutes from '../modules/call/call.routes';
import sessionReviewRoutes from '../modules/session-review/session-review.routes';
import adminRoutes from '../modules/admin/admin.routes';

// main.ts ফাইলটি আমাদের সব রাউটকে (Route) এক জায়গায় যুক্ত করার কাজ করে।
// এখান থেকে সব রাউটগুলোকে app.ts ফাইলে পাঠানো হয়, ফলে কোড পরিষ্কার থাকে।

const router = Router();

// /api/v1/auth দিয়ে শুরু হওয়া সব রিকোয়েস্ট authRoutes এ চলে যাবে
router.use('/auth', authRoutes);

// /api/v1/users দিয়ে শুরু হওয়া সব রিকোয়েস্ট userRoutes এ চলে যাবে
router.use('/users', userRoutes);

// /api/v1/categories দিয়ে শুরু হওয়া সব রিকোয়েস্ট categoryRoutes এ চলে যাবে
router.use('/categories', categoryRoutes);

// /api/v1/contents দিয়ে শুরু হওয়া সব রিকোয়েস্ট contentRoutes এ চলে যাবে
router.use('/contents', contentRoutes);

// /api/v1/settings দিয়ে শুরু হওয়া সব রিকোয়েস্ট settingsRoutes এ চলে যাবে
router.use('/settings', settingsRoutes);

// /api/v1/stories দিয়ে শুরু হওয়া সব রিকোয়েস্ট storyRoutes এ চলে যাবে
router.use('/stories', storyRoutes);

// /api/v1/block-users দিয়ে শুরু হওয়া সব রিকোয়েস্ট blockRoutes এ চলে যাবে
router.use('/block-users', blockRoutes);

// /api/v1/follows দিয়ে শুরু হওয়া সব রিকোয়েস্ট followRoutes এ চলে যাবে
router.use('/follows', followRoutes);

// /api/v1/notifications দিয়ে শুরু হওয়া সব রিকোয়েস্ট notificationRoutes এ চলে যাবে
router.use('/notifications', notificationRoutes);

// /api/v1/referrals দিয়ে শুরু হওয়া সব রিকোয়েস্ট referralRoutes এ চলে যাবে
router.use('/referrals', referralRoutes);

// /api/v1/wallets দিয়ে শুরু হওয়া সব রিকোয়েস্ট walletRoutes এ চলে যাবে
router.use('/wallets', walletRoutes);

// /api/v1/payments দিয়ে শুরু হওয়া সব রিকোয়েস্ট paymentRoutes এ চলে যাবে
router.use('/payments', paymentRoutes);

// /api/v1/products দিয়ে শুরু হওয়া সব রিকোয়েস্ট productRoutes এ চলে যাবে
router.use('/products', productRoutes);

// /api/v1/cart দিয়ে শুরু হওয়া সব রিকোয়েস্ট cartRoutes এ চলে যাবে
router.use('/cart', cartRoutes);

// /api/v1/shipping-addresses দিয়ে শুরু হওয়া সব রিকোয়েস্ট shippingAddressRoutes এ চলে যাবে
router.use('/shipping-addresses', shippingAddressRoutes);

// /api/v1/orders দিয়ে শুরু হওয়া সব রিকোয়েস্ট orderRoutes এ চলে যাবে
router.use('/orders', orderRoutes);

// /api/v1/calls দিয়ে শুরু হওয়া সব রিকোয়েস্ট callRoutes এ চলে যাবে
router.use('/calls', callRoutes);

// /api/v1/session-reviews দিয়ে শুরু হওয়া সব রিকোয়েস্ট sessionReviewRoutes এ চলে যাবে
router.use('/session-reviews', sessionReviewRoutes);

// /api/v1/admin দিয়ে শুরু হওয়া সব রিকোয়েস্ট adminRoutes এ চলে যাবে
router.use('/admin', adminRoutes);

export default router;




