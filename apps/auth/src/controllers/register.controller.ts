import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required' });
  }

  // تحقق مما إذا كان المستخدم موجودًا مسبقًا
  const existingUser = await User.findOne({ username }).exec();
  if (existingUser) {
    return res.status(409).json({ error: 'Username already exists' }); // Conflict
  }

  try {
    // هاش لكلمة المرور
    const hashedPwd = await bcrypt.hash(password, 10);

    // إنشاء مستخدم جديد
    const newUser = new User({
      username,
      password: hashedPwd,
      role: role, // role اختياري حسب هيكلية قاعدة البيانات
    });

    const savedUser = await newUser.save();

    // إنشاء access token و refresh token
    const accessToken = jwt.sign(
      {
        username: savedUser.username,
        role: Object.values(savedUser.role),
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '600s' }
    );

    const refreshToken = jwt.sign(
      { username: savedUser.username },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '10d' }
    );

    // حفظ refresh token في المستخدم
    savedUser.refreshToken = [refreshToken];
    await savedUser.save();

    // إرسال الكوكي
    return (
      res
        // // cookie('jwt', refreshToken, {
        // //         httpOnly: true,
        // //         maxAge: 240 * 60 * 60 * 1000,
        // //     })
        .status(201)
        .json({
          message: 'User registered successfully',
          accessToken,
          refreshToken, // <== أضف هذا إن أردت
        })
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
