import { Request, Response } from 'express';
import axios from 'axios';

const authUrl = process.env.AUTH_URL!;

const home = (req: Request, res: Response) => {
  const user = req['user']; // assume added by auth middleware
  return res.json({ message: `Hello ${user?.name || 'world'}!` });
};

// POST /login with body: { username, password }
const login = async (req: Request, res: Response) => {
  const user = req.body;
  const functionName='login';
  console.debug(`[DEBUG][gateway][${functionName}] :user ${user.username}.`);

  try {
    const response = await axios.post(`${authUrl}/login`, user);

    // Optionally: forward the entire response or a subset
    return res.status(200).json({
      message: `Success logging in as ${user.username}!`,
      data: response.data,
    });
  } catch (error: any) {
    // Handle Axios errors gracefully
  console.debug(`[DEBUG][gateway][${functionName}] error: ${error}`);
  const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Authentication failed';

    return res.status(status).json({ message });
  }
};

export { home, login };
