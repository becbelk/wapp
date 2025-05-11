import { Request, Response } from 'express';
import User from '../models/user.model';
export const profile = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const user = await  User.findOne({ refreshToken: { $in: [refreshToken] } });
  if(user)
  {return res.json(user)}
  else{
    return res.status(500).json({error:"no user found"})
  }
};
