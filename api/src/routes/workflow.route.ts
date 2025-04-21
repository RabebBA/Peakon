import { Router } from 'express';
import { WorkflowController } from '@/controllers/workflow.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { WorkFlowModel } from '@/models/workflow.model';

export class WorkflowRoute implements Routes {
  public path = '/workflow';
  public router = Router();
  public workflow = new WorkflowController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, this.workflow.getAllWorkFlows);
    this.router.get(`${this.path}/:id`, AuthMiddleware, this.workflow.getWorkFlowById);
    this.router.post(`${this.path}`, AuthMiddleware, this.workflow.createWorkFlow);
    this.router.put(`${this.path}/:id`, AuthMiddleware, this.workflow.updateWorkFlow);
    this.router.delete(`${this.path}/:id`, AuthMiddleware, this.workflow.deleteWorkFlow);
    this.router.post(`${this.path}/validate/:projectId`, AuthMiddleware, this.workflow.validateProjectWorkflow);
    this.router.post(`${this.path}/clone`, AuthMiddleware, this.workflow.cloneWorkflow);
  }
}
