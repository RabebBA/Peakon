import { Router } from 'express';
import { ProjectController } from '@controllers/project.controller';
import { CreateProjectDto, UpdateProjectDto } from '@dtos/project.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { verifyAdmin } from '@/middlewares/admin.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class ProjectRoute implements Routes {
  public path = '/project';
  public router = Router();
  public project = new ProjectController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, this.project.getProjects);
    this.router.get(`${this.path}/archived`, AuthMiddleware, this.project.getArchivedProjects);
    this.router.get(`${this.path}/:id`, AuthMiddleware, this.project.getProjectById);
    this.router.post(`${this.path}`, AuthMiddleware, /*verifyAdmin,ValidationMiddleware(CreateProjectDto),*/ this.project.createProject);
    this.router.put(`${this.path}/:id`, AuthMiddleware, /*verifyAdmin,*/ ValidationMiddleware(UpdateProjectDto), this.project.updateProject);
    //this.router.delete(`${this.path}/:id`, AuthMiddleware, /*verifyAdmin,*/ this.project.deleteProject);
    this.router.patch(`${this.path}/:id/archive`, AuthMiddleware, this.project.archiveProject);
    this.router.patch(`${this.path}/:id/unarchive`, AuthMiddleware, this.project.unarchiveProject);
  }
}
