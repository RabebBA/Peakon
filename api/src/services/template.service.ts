import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { ITemplate } from '@/interfaces/template.interface';
import { TemplateModel } from '@/models/template.model';
import { IWorkFlow } from '@/interfaces/workflow.interface';
import { ProjectModel } from '@/models/project.model';

@Service()
export class TemplateService {
  public findAllTemplates = async (): Promise<ITemplate[]> => {
    return await TemplateModel.find();
  };

  public getTemplateById = async (templateId: string): Promise<ITemplate> => {
    const template = await TemplateModel.findById(templateId);
    if (!template) throw new HttpException(404, 'Template not found');
    return template;
  };

  public createTemplate = async (templateData: ITemplate): Promise<ITemplate> => {
    const existing = await TemplateModel.findOne({ name: templateData.name });
    if (existing) throw new HttpException(409, `Template name '${templateData.name}' already exists`);
    return await TemplateModel.create(templateData);
  };

  public updateTemplate = async (templateId: string, templateData: ITemplate): Promise<ITemplate> => {
    const existingTemplate = await TemplateModel.findById(templateId);
    if (!existingTemplate) throw new HttpException(404, 'Template not found');

    // Si le projectId change, créer un nouveau template au lieu de mettre à jour
    if (templateData.projectId && templateData.projectId.toString() !== existingTemplate.projectId?.toString()) {
      return await TemplateModel.create(templateData);
    }

    existingTemplate.name = templateData.name || existingTemplate.name;
    existingTemplate.workflows = templateData.workflows || existingTemplate.workflows;

    return await existingTemplate.save();
  };

  public deleteTemplate = async (templateId: string): Promise<ITemplate> => {
    const deleted = await TemplateModel.findByIdAndDelete(templateId);
    if (!deleted) throw new HttpException(404, 'Template not found');
    return deleted;
  };

  public cloneTemplate = async (sourceProjectId: string, targetProjectId: string): Promise<ITemplate> => {
    const sourceProject = await ProjectModel.findById(sourceProjectId);
    const template = await TemplateModel.findById(sourceProject.template);
    if (!template || !template.projectId) {
      throw new HttpException(400, 'Only project-specific templates can be cloned');
    }

    const targetProject = await ProjectModel.findById(targetProjectId);
    const cloned = new TemplateModel({
      name: `${template.name} (Clone for project ${targetProject.name})`,
      workflows: template.workflows,
      projectId: targetProjectId,
    });

    return await cloned.save();
  };

  public getTemplateByProjectId = async (projectId: string): Promise<ITemplate[]> => {
    return await TemplateModel.find({ projectId });
  };

  public getTemplate = async (): Promise<ITemplate[]> => {
    return await TemplateModel.find({ $or: [{ projectId: { $exists: true, $size: 0 } }, { projectId: { $exists: false } }] });
  };
}
