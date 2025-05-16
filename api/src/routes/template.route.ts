import { Router } from 'express';
import { Routes } from '@/interfaces/routes.interface';
import { TemplateController } from '@/controllers/template.controller';

export class TemplateRoute implements Routes {
  public path = '/template';
  public router = Router();
  public template = new TemplateController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // CRUD
    this.router.get(`${this.path}`, this.template.findAllTemplates);
    this.router.get(`${this.path}/:id`, this.template.getTemplateById);
    this.router.post(`${this.path}`, this.template.createTemplateWithDependencies);

    /*this.router.post(`${this.path}`, this.template.createTemplate);
    this.router.put(`${this.path}/:id`, this.template.updateTemplate);*/
    this.router.delete(`${this.path}/:id`, this.template.deleteTemplate);

    // Cloner un template spécifique à un projet
    //this.router.post(`${this.path}/:id/clone`, this.template.cloneTemplate);

    // Récupérer les templates d’un projet
    this.router.get(`${this.path}/:id/project/:projectId`, this.template.getTemplateByProjectId);

    // Récupérer les templates généraux
    this.router.get(`${this.path}/:id/general/list`, this.template.getTemplate);
  }
}
