import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './auth';

export interface AuthenticatedRequest extends NextApiRequest {
  admin?: {
    email: string;
    isAdmin: boolean;
  };
}

export function requireAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.isAdmin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.admin = payload;
    return handler(req, res);
  };
}




