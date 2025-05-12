import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const loginWithPassword = async (
  req: Request,
  res: Response
) => {
  const functionName='loginWithPassword';
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET! as string;
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET! as string;
  const ACCESS_TOKEN_EXPIRACY = process.env.ACCESS_TOKEN_EXPIRES_IN! as string;
  const REFRESH_TOKEN_EXPIRACY = process.env.REFRESH_TOKEN_EXPIRES_IN! as string;
  
  if (!REFRESH_TOKEN_SECRET||!ACCESS_TOKEN_SECRET || !ACCESS_TOKEN_EXPIRACY || !REFRESH_TOKEN_EXPIRACY)
    throw new Error('JWT configuration not defined'); 
   const { username, password } = req.body as {
    "username": string;
    "password": string;
  };
  const user = await User.findOne({ username }); //search in db
  if (!user) {
    return res
      .status(401)
      .json({ error: 'الحساب غير مسجل أو كلمة المرور غير صحيحة' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res
      .status(401)
      .json({ error: 'الحساب غير مسجل أو كلمة المرور غير صحيحة' });
  }
  // update lastLogin
  user.lastLogin = new Date();
  
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    ACCESS_TOKEN_SECRET!,
    {
      expiresIn: '7h',
    }
  );
  const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: '10d',
  });
  user.refreshToken = [...user.refreshToken, refreshToken];
  await user.save();
  
  console.debug(`[DEBUG][auth][${functionName}] :user ${user.username} saved refreshToken! `);
  return res.status(200).json({ accessToken, refreshToken });
};
