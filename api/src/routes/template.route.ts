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
    this.router.get('/', this.template.findAllTemplates);
    this.router.get('/:id', this.template.getTemplateById);
    this.router.post('/', this.template.createTemplate);
    this.router.put('/:id', this.template.updateTemplate);
    this.router.delete('/:id', this.template.deleteTemplate);

    // Cloner un template spécifique à un projet
    this.router.post('/:id/clone', this.template.cloneTemplate);

    // Récupérer les templates d’un projet
    this.router.get('/project/:projectId', this.template.getTemplateByProjectId);

    // Récupérer les templates généraux
    this.router.get('/general/list', this.template.getTemplate);
  }
}
