import jwt from 'jsonwebtoken';

// jwt.ts ফাইলটি ইউজারের জন্য অ্যাক্সেস টোকেন (AccessToken) এবং রিফ্রেশ টোকেন (RefreshToken) জেনারেট করার কাজ করে।
// এই টোকেনগুলো দিয়ে ইউজার পরবর্তীতে লগিন ছাড়াই আমাদের API গুলো ব্যবহার করতে পারবে।

export const generateTokens = (userId: number) => {
  // Access Token: এটি অল্প সময়ের জন্য (যেমন ১৫ মিনিট) কাজ করবে
  const accessToken = jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET || 'secret123', 
    { expiresIn: '15m' }
  );
  
  // Refresh Token: এটি বেশি সময়ের জন্য (যেমন ৭ দিন) কাজ করবে
  const refreshToken = jwt.sign(
    { id: userId }, 
    process.env.JWT_REFRESH_SECRET || 'refreshSecret123', 
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};