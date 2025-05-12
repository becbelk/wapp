import { Request, Response } from 'express';
import User from '../models/user.model';

export const logout = async (req : Request, res: Response) => {
    // On client, also delete the accessToken

    const {refreshToken} = req.body;
  
    // Is refreshToken in db?
    const foundUser =await User.findOne({
        refreshToken: { $in: [refreshToken] }
      });
    if (!foundUser) {
      ////  res.clearCookie('jwt', { httpOnly: true, /*sameSite: 'None', secure: true*/ });
        return res.sendStatus(204);
    }

    // //Delete refreshToken in db
    foundUser.refreshToken = foundUser.refreshToken.filter((rt: string) => rt !== refreshToken);;
    const result = await foundUser.save();
    console.log(result);

    ////res.clearCookie('jwt', { httpOnly: true, /*sameSite: 'None', secure: true*/});
    return res.sendStatus(204).json({success:"refreshToken deleted"});
}

