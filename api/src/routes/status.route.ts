import { Router } from 'express';
import { StatusController } from '@/controllers/status.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class StatusRoute implements Routes {
  public path = '/status';
  public router = Router();
  public status = new StatusController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, this.status.getAllStatuses);
    this.router.get(`${this.path}/:id`, AuthMiddleware, this.status.getStatusById);
    this.router.post(`${this.path}`, AuthMiddleware, this.status.createStatus);
    this.router.put(`${this.path}/:id`, AuthMiddleware, this.status.updateStatus);
    this.router.delete(`${this.path}/:id`, AuthMiddleware, this.status.deleteStatus);
  }
}
