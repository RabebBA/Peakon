import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { HttpException } from '@/exceptions/httpException';

import { IWorkFlow } from '@/interfaces/workflow.interface';
import { WorkFlowService } from '@/services/workflow.service';

import { TemplateModel } from '@/models/template.model';
import { WorkFlowModel } from '@/models/workflow.model';
import { ProjectModel } from '../models/project.model';

export class WorkflowController {
  public getAllWorkFlows = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workflowService = Container.get(WorkFlowService);

      const workflows: IWorkFlow[] = await workflowService.findAllWorkFlows();
      res.status(200).json({ data: workflows });
    } catch (error) {
      next(error);
    }
  };

  public getWorkFlowById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workflowService = Container.get(WorkFlowService);

      const { id } = req.params;
      const workflow: IWorkFlow = await workflowService.findWorkFlowById(id);
      res.status(200).json({ data: workflow });
    } catch (error) {
      next(error);
    }
  };

  public createWorkFlow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workflowService = Container.get(WorkFlowService);

      const data: IWorkFlow = req.body;
      const newWorkflow = await workflowService.createWorkFlow(data);
      res.status(201).json({ data: newWorkflow });
    } catch (error) {
      next(error);
    }
  };

  public updateWorkFlow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workflowService = Container.get(WorkFlowService);

      const { id } = req.params;
      const updateData: Partial<IWorkFlow> = req.body;
      const updatedWorkflow = await workflowService.updateWorkFlow(id, updateData);
      res.status(200).json({ data: updatedWorkflow });
    } catch (error) {
      next(error);
    }
  };

  public deleteWorkFlow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workflowService = Container.get(WorkFlowService);

      const { id } = req.params;
      const deletedWorkflow = await workflowService.deleteWorkFlow(id);
      res.status(200).json({ data: deletedWorkflow });
    } catch (error) {
      next(error);
    }
  };

  // Correction : Ajout de types explicites à statusMap et visited
  public validateWorkflowGraph = (workflows: IWorkFlow[]) => {
    const statusMap = new Map<string, { targetStatus: string }[]>();
    workflows.forEach(step => statusMap.set(step.status, step.transitions));

    // Vérifier les cycles et les états inaccessibles
    const visited = new Set<string>();
    const stack = new Set<string>();

    const detectCycle = (status: string): boolean => {
      if (stack.has(status)) return true;
      if (visited.has(status)) return false;

      stack.add(status);
      visited.add(status);

      for (const transition of statusMap.get(status) || []) {
        if (detectCycle(transition.targetStatus)) return true;
      }

      stack.delete(status);
      return false;
    };

    for (const status of statusMap.keys()) {
      if (detectCycle(status)) {
        throw new Error('Workflow contains cyclic dependencies');
      }
    }

    return true;
  };

  public validateProjectWorkflow = async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const project = await ProjectModel.findById(projectId);

      if (!project) return res.status(404).json({ message: 'Project not found' });

      // Vérifier si le workflows existe pour le projet et s'assurer qu'il est un tableau
      const template = await TemplateModel.findById(project.template);
      const workflows = await WorkFlowModel.find({ _id: { $in: template.workflows } });
      if (!workflows) {
        return res.status(400).json({ message: 'Workflow not found' });
      }

      // Si le workflows est un objet unique, le convertir en tableau
      const workflowssArray = Array.isArray(workflows) ? workflows : [workflows];

      this.validateWorkflowGraph(workflowssArray);
      res.json({ valid: true });
    } catch (error) {
      res.status(400).json({ valid: false, message: error.message });
    }
  };

  public cloneWorkflow = async (req: RequestWithUser, res: Response) => {
    try {
      const { sourceProjectId, targetProjectId } = req.body;

      const sourceProject = await ProjectModel.findById(sourceProjectId);
      const targetProject = await ProjectModel.findById(targetProjectId);

      if (!sourceProject || !targetProject) {
        return res.status(404).json({ message: 'Project not found' });
      }

      // Vérifier les permissions
      const canEdit = targetProject.members.some(m => m.userId === req.user!._id && m.roles.includes('ADMIN'));

      if (!canEdit) throw new HttpException(401, 'Unauthorized workflow modification');

      // Récupérer les templates associés aux projets
      const sourceTemplate = await TemplateModel.findById(sourceProject.template);
      const targetTemplate = await TemplateModel.findById(targetProject.template);

      if (!sourceTemplate || !targetTemplate) {
        return res.status(404).json({ message: 'Template not found' });
      }

      // Cloner la liste des workflows du template source vers le template cible
      targetTemplate.workflows = [...sourceTemplate.workflows];

      // Sauvegarder le template cible
      await targetTemplate.save();

      res.json(targetProject);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
}
