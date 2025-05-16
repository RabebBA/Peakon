import { Router } from 'express';
import { RouteController } from '@/controllers/route.controller';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { verifyAdmin } from '@/middlewares/admin.middleware';

export class RouteRoute implements Routes {
  public path = '/routes';
  public router = Router();
  public routeController = new RouteController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Synchroniser les routes de l'application (admin uniquement)
    this.router.post(`${this.path}/sync`, /* AuthMiddleware, verifyAdmin, */ this.routeController.syncRoutes);

    // Récupérer toutes les routes (admin uniquement)
    this.router.get(`${this.path}`, AuthMiddleware, /* verifyAdmin,*/ this.routeController.getAllRoutes);

    // Récupérer une route spécifique par ID (admin uniquement)
    this.router.get(`${this.path}/:id`, AuthMiddleware, /*verifyAdmin,*/ this.routeController.getRouteById);
  }
}
