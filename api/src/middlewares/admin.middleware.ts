import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';

export const verifyAdmin = (req: RequestWithUser, res: Response, next: NextFunction) => {
  // Vérifier si le rôle "ADMIN" existe dans le tableau des rôles de l'utilisateur
  if (!req.user.role || !req.user.role.includes('ADMIN')) {
    return res.status(403).json({ message: 'Access denied' });
  }

  next();
};
