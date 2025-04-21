import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { HttpException } from '@/exceptions/httpException';

export const ValidationMiddleware = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validation des données de la requête avec le schéma Zod
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      // Si une erreur Zod est levée
      if (error instanceof ZodError) {
        // On extrait et joint tous les messages d'erreur
        const message = error.errors.map(err => err.message).join(', ');
        return next(new HttpException(400, message));
      }
      // Si l'erreur n'est pas liée à Zod, on renvoie une erreur générique
      return next(new HttpException(400, 'Données de la requête invalides'));
    }
  };
};
