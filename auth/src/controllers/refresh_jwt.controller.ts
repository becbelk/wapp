import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
  username: string;
}

export const refreshJWT = async (req: Request, res: Response): Promise<Response | void> => {
  const {refreshToken} = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: '[auth_service][refresh_jwt.controller] No refreshToken' });
  }

  const foundUser = await  User.findOne({ refreshToken: { $in: [refreshToken] } });

  // حالة محاولة استخدام توكن غير صالح (مخترق أو مزور)
  if (!foundUser) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as DecodedToken;
      console.warn('Detected refresh token reuse!');
      const hackedUser = await User.findOne({ username: decoded.username }).exec();
      if (hackedUser) {
        hackedUser.refreshToken = [];
        await hackedUser.save();
      }
    } catch (err) {
      console.error('Failed to verify reused refresh token:', err);
    }
    return res.sendStatus(403);
  }

  // حذف التوكن القديم من القائمة
  const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as DecodedToken;

    if (foundUser.username !== decoded.username) {
      return res.sendStatus(403);
    }

    const role = Object.values(foundUser.role); // أو foundUser.role حسب النموذج
    const accessToken = jwt.sign(
      {
        username: decoded.username,
        role: role
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '10m' }
    );

    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '10d' }
    );

    // حفظ التوكن الجديد
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await foundUser.save();

    // // إعادة إرسال التوكن في الكوكي
    // // res.cookie('jwt', newRefreshToken, {
    // //   httpOnly: true,
    // //   secure: process.env.NODE_ENV === 'production',
    // //   sameSite: 'strict',
    // //   maxAge: 10 * 24 * 60 * 60 * 1000 // 10 أيام
    // // });

    return res.json({ role: role, accessToken });

  } catch (err) {
    console.warn('Refresh token expired or invalid:', err);
    foundUser.refreshToken = newRefreshTokenArray;
    await foundUser.save();
    return res.sendStatus(403);
  }
};
