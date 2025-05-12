import { Request, Response } from 'express';
import axios from 'axios';

const authUrl = process.env.AUTH_URL!;
if (!authUrl) {
  throw new Error("AUTH_URL is not defined in environment variables.");
}

// Utility function to handle proxying requests to Auth Service
const forwardToAuthService = async (
  endpoint: string,
  payload: any,
  res: Response,
  successMsg: string,
  functionName: string
) => {
  try {
    const response = await axios.post(`${authUrl}${endpoint}`, payload);

    console.debug(`[DEBUG][gateway][${functionName}] success.`);
    return res.status(200).json({
      message: successMsg,
      data: response.data,
    });
  } catch (error: any) {
    const status = error.response?.status || 500;
    const errMsg =
      error.response?.data?.message || 'An error occurred while forwarding to auth service';

    console.error(`[ERROR][gateway][${functionName}] ${errMsg}`);
    return res.status(status).json({ message: errMsg });
  }
};

// ==================== ROUTES ====================

const home = async (req: Request, res: Response) => {
  const user = req['user']; // added by auth middleware
  return res.json({ message: `Hello ${user?.name || 'world'}!` });
};

const login = async (req: Request, res: Response) => {
  const functionName = 'login';
  console.debug(`[DEBUG][gateway][${functionName}] Login attempt for: ${req.body.username}`);
  return forwardToAuthService('/login', req.body, res, `Logged in as ${req.body.username}`, functionName);
};

const register = async (req: Request, res: Response) => {
  const functionName = 'register';
  console.debug(`[DEBUG][gateway][${functionName}] Registering user: ${req.body.username}`);
  return forwardToAuthService(
    '/register',
    req.body,
    res,
    `User ${req.body.username} registered successfully`,
    functionName
  );
};

const refresh = async (req: Request, res: Response) => {
  const functionName = 'refresh';
  console.debug(`[DEBUG][gateway][${functionName}] Refreshing token`);
  return forwardToAuthService(
    '/refresh',
    req.body,
    res,
    `Token refreshed successfully`,
    functionName
  );
};

export { home, login, register, refresh };
