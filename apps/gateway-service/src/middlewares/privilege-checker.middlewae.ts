import { Request, Response, NextFunction } from 'express';

const requirePrivilege = (requiredPrivilege: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req['user'];

    if (!user || !user.privileges) {
      return res.status(403).json({ message: 'Privileges not found' });
    }

    const hasAccess = user.privileges.includes(requiredPrivilege);

    if (!hasAccess) {
      return res.status(403).json({ message: `Access denied: Missing ${requiredPrivilege} privilege` });
    }

    next();
  };
};

export default requirePrivilege;
