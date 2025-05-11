// routes/hasAuthority.ts
import { Request, Response } from 'express';
import { rolePermissions } from '../config/roles';

export const hasAuthority = (req: Request, res: Response) => {
  const role = parseInt(req.query.role as string);          // ?role=200
  const operation = req.query.operation as string;          // ?operation=insert
console.log("[auth_service][hasAuthority] role:",role," operation :",operation);
  if (isNaN(role) || !operation) {
    return res.status(400).json({ error: 'Missing role or operation' });
  }

  const allowedOps = rolePermissions[role];

  if (!allowedOps) {
    return res.status(400).json({ error: 'Unknown role' });
  }

  const hasPrivilege = allowedOps.includes(operation);
  return res.json({ hasPrivilege });
};
