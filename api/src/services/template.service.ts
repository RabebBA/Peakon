import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { ITemplate } from '@/interfaces/template.interface';
import { TemplateModel } from '@/models/template.model';
import { ProjectModel } from '@/models/project.model';
import { WorkFlowModel } from '@/models/workflow.model';
import { RoleModel } from '@/models/role.model';
import { UserModel } from '@/models/users.model';
import { StatusModel } from '@/models/status.model';
import { IWorkFlow } from '@/interfaces/workflow.interface';
import { TransitionModel } from '@/models/transition.model';

interface CreateTemplatePayload {
  name: string;
  statuses: Array<{
    status: string;
    special?: 'Initial' | 'Final';
    isScalable: boolean;
  }>;
  transitions: Array<{
    targetStatus: string;
    allowedRoles?: string[];
    notifRoles?: string[];
    conditions?: {
      requiredFields: string[];
      validationSchema: object;
    };
  }>;
  roles: string[];
}

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

  public createTemplateWithDependencies = async (payload: CreateTemplatePayload) => {
    const { name, statuses, transitions, roles } = payload;

    // 1. Créer les Status et construire le mapping label -> ObjectId
    const createdStatuses = await StatusModel.insertMany(statuses);
    const statusMap = new Map<string, any>();
    createdStatuses.forEach(status => statusMap.set(status.status, status._id));

    // 2. Créer les Transitions en utilisant le mapping pour targetStatus
    const createdTransitions = await TransitionModel.insertMany(
      transitions.map(t => ({
        targetStatus: statusMap.get(t.targetStatus), // <-- conversion ici !
        allowedRoles: t.allowedRoles || [],
        notifRoles: t.notifRoles || [],
        conditions: t.conditions || { requiredFields: [], validationSchema: {} },
      })),
    );

    // 3. Créer le WorkFlow
    const initialStatus = createdStatuses.find(s => s.special === 'Initial');
    if (!initialStatus) throw new Error("Un statut 'Initial' est requis");

    const workflow = await WorkFlowModel.create({
      status: initialStatus._id,
      transitions: createdTransitions.map(t => t._id),
    });

    // 4. Créer la Template
    const template = await TemplateModel.create({
      name,
      workflows: [workflow._id],
      roles,
    });

    return template;
  };

  /*public createTemplate = async (templateData: ITemplate & { workflows: IWorkFlow[] }): Promise<ITemplate> => {
    const existing = await TemplateModel.findOne({ name: templateData.name });
    if (existing) {
      throw new HttpException(409, `Template name '${templateData.name}' already exists`);
    }

    // 1. Valider et créer tous les workflows
    const workflowIds: IWorkFlow['_id'][] = [];
    for (const wf of templateData.workflows) {
      // Vérifier statut source
      const sourceStatus = await StatusModel.findById(wf.status);
      if (!sourceStatus) {
        throw new Error(`Statut source introuvable : ${wf.status}`);
      }

      for (const transition of wf.transitions) {
        const targetStatus = await StatusModel.findById(transition.targetStatus);
        if (!targetStatus) {
          throw new Error(`Statut de transition introuvable : ${transition.targetStatus}`);
        }

        if (transition.allowedRoles?.length) {
          const roles = await RoleModel.find({ _id: { $in: transition.allowedRoles }, type: 'Project' });
          if (roles.length !== transition.allowedRoles.length) {
            throw new Error(`Certains rôles de transition sont introuvables.`);
          }
        }

       
        if (transition.notifRoles?.length) {
          const notifRoles = await RoleModel.find({ _id: { $in: transition.notifRoles }, type: 'Project' });
          if (notifRoles.length !== transition.notifRoles.length) {
            throw new Error(`Certains rôles de notification sont introuvables.`);
          }
        }
      }

      // Créer le workflow et stocker son ID
      const created = await WorkFlowModel.create(wf);
      workflowIds.push(created._id);
    }

    // 2. Créer le template avec les IDs des workflows
    const createdTemplate = await TemplateModel.create({
      name: templateData.name,
      projectId: templateData.projectId,
      workflows: workflowIds,
    });

    return createdTemplate;
  };*/

  /* public updateTemplate = async (templateId: string, templateData: ITemplate): Promise<ITemplate> => {
    const existingTemplate = await TemplateModel.findById(templateId);
    if (!existingTemplate) throw new HttpException(404, 'Template not found');

    // Si le projectId change, créer un nouveau template au lieu de mettre à jour
    if (templateData.projectId && templateData.projectId.toString() !== existingTemplate.projectId?.toString()) {
      return await TemplateModel.create(templateData);
    }

    existingTemplate.name = templateData.name || existingTemplate.name;
    existingTemplate.workflows = templateData.workflows || existingTemplate.workflows;

    return await existingTemplate.save();
  };*/

  public deleteTemplate = async (templateId: string): Promise<ITemplate> => {
    const deleted = await TemplateModel.findByIdAndDelete(templateId);
    if (!deleted) throw new HttpException(404, 'Template not found');
    return deleted;
  };

  /*public cloneTemplate = async (sourceProjectId: string, targetProjectId: string): Promise<ITemplate> => {
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
  };*/

  public getTemplateByProjectId = async (projectId: string): Promise<ITemplate[]> => {
    return await TemplateModel.find({ projectId });
  };

  public getTemplate = async (): Promise<ITemplate[]> => {
    return await TemplateModel.find({ $or: [{ projectId: { $exists: true, $size: 0 } }, { projectId: { $exists: false } }] });
  };
}
