// gateway.middleware.ts
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({message:'no token found!'})
    }

    // Replace with actual Auth service URL
    const authServiceUrl = '/verify'; 

    const response = await axios.get(authServiceUrl, {
      headers: {
        Authorization: token,
      },
    });

    if (response.status === 200) {
      // Optionally attach user info to req for downstream use
      req['user'] = response.data;
      return next();
    }

    return res.status(401).json({ error: 'Unauthorized' });
  } catch (error: any) {
    console.error('[AUTH MIDDLEWARE] Auth failed:', error.message);
    return res.status(401).json({ error: 'Invalid token or auth error' });
  }
};

export default auth;
