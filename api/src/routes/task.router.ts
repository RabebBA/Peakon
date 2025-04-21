import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { TaskController } from '@/controllers/task.controller';
import { Routes } from '@interfaces/routes.interface';

export class TaskRoute implements Routes {
  public path = '/tasks';
  public router = Router();
  public task = new TaskController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`/projects/:projectId${this.path}`, AuthMiddleware, this.task.createTask);
    this.router.put(`${this.path}/:taskId/status`, AuthMiddleware, this.task.updateTaskStatus);
    this.router.get(`${this.path}/:taskId`, AuthMiddleware, this.task.getTaskDetails);
    //this.router.delete(`${this.path}/:taskId`, AuthMiddleware, this.task.deleteTask);
  }
}
