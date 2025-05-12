// routes/checkPrivilege.ts
import { Request, Response } from 'express';
import { rolePermissions } from '../config/roles';

export const checkPrivilege = (req: Request, res: Response) => {
  const roleId = Number(req.query.role); // ?role=200
  const operation = String(req.query.operation || '').toLowerCase(); // ?operation=insert

  const logPrefix = '[auth_service][checkPrivilege]';

  console.debug(`${logPrefix} Received role: ${roleId}, operation: ${operation}`);

  try {
    // Validate input
    if (!roleId || !operation) {
      return res.status(400).json({ error: 'Missing or invalid role or operation' });
    }

    const allowedOperations = rolePermissions[roleId];

    if (!allowedOperations) {
      return res.status(400).json({ error: 'Unknown role ID' });
    }

    const hasPrivilege = allowedOperations.includes(operation);

    console.debug(`${logPrefix} Allowed ops: ${allowedOperations.join(', ')} | Has privilege: ${hasPrivilege}`);

    return res.status(200).json({
      role: roleId,
      operation,
      hasPrivilege,
      allowedOperations,
    });

  } catch (error: any) {
    console.error(`${logPrefix} Exception occurred:`, error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
