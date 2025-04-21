import { Request, Response, NextFunction } from 'express';
import { TemplateService } from '@/services/template.service';
import { ITemplate } from '@/interfaces/template.interface';
import { HttpException } from '@/exceptions/httpException';

export class TemplateController {
  private templateService = new TemplateService();

  public findAllTemplates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const templates: ITemplate[] = await this.templateService.findAllTemplates();
      res.status(200).json({ data: templates, message: 'Templates retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getTemplateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const template = await this.templateService.getTemplateById(id);
      res.status(200).json({ data: template, message: 'Template retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public createTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const templateData: ITemplate = req.body;
      const newTemplate = await this.templateService.createTemplate(templateData);
      res.status(201).json({ data: newTemplate, message: 'Template created successfully' });
    } catch (error) {
      next(error);
    }
  };

  public updateTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const templateData: ITemplate = req.body;
      const updated = await this.templateService.updateTemplate(id, templateData);
      res.status(200).json({ data: updated, message: 'Template updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public deleteTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleted = await this.templateService.deleteTemplate(id);
      res.status(200).json({ data: deleted, message: 'Template deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  public cloneTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sourceProjectId = req.headers['x-source-project-id'] as string;
      const targetProjectId = req.headers['x-target-project-id'] as string;

      if (!sourceProjectId || !targetProjectId) {
        throw new HttpException(400, 'Both source and target project IDs must be provided in headers');
      }

      const clonedTemplate = await this.templateService.cloneTemplate(sourceProjectId, targetProjectId);
      res.status(201).json({ data: clonedTemplate, message: 'Template cloned successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getTemplateByProjectId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const templates = await this.templateService.getTemplateByProjectId(projectId);
      res.status(200).json({ data: templates, message: 'Project templates retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const templates = await this.templateService.getTemplate();
      res.status(200).json({ data: templates, message: 'General templates retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };
}
