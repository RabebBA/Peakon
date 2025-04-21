/*import { Request, Response } from 'express';

import { TaskModel } from '../models/task.model';
import { ProjectModel } from '../models/project.model';
import { WorkFlowService } from '../services/workflow.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { TaskSchema } from '@/dtos/task.dto';
import { RouteModel } from '@/models/route.model';
import { RoleModel } from '@/models/role.model';
import { TemplateModel } from '@/models/template.model';
import { WorkFlowModel } from '@/models/workflow.model';
import { PrivilegeModel } from '@/models/privilege.model';
import Container from 'typedi';

export class TaskController {
  public createTask = async (req: RequestWithUser, res: Response) => {
    try {
      const { projectId } = req.params;
      const data = TaskSchema.parse(req.body);
      const userId = req.user!._id;

      const routeSignature = 'POST /projects/:projectId/tasks';

      // Vérifier l'existence du projet
      const project = await ProjectModel.findById(projectId).populate('members.roles').populate('members.privileges');
      if (!project) return res.status(404).json({ message: 'ProjectModel not found' });

      const member = project.members.find(m => m.userId === userId);
      if (!member) return res.status(403).json({ message: 'Utilisateur non membre du projet' });

      // Charger la route correspondante
      const route = await RouteModel.findOne({ endPoint: routeSignature });
      if (!route) return res.status(500).json({ message: 'Route non enregistrée' });

      const routeId = route._id;

      // Vérifier les privilèges par rôles
      const hasPrivilegeViaRole = await RoleModel.exists({
        _id: { $in: member.roles },
        privId: routeId,
        $or: [{ type: 'Global' }, { type: 'Project', projectId }],
      });

      // Vérifier les privilèges directs
      const privileges = await PrivilegeModel.find(member.privileges);
      const hasDirectPrivilege = privileges.some(privilege => privilege.routeId === routeId);

      if (!hasPrivilegeViaRole && !hasDirectPrivilege) {
        return res.status(403).json({ message: 'Accès refusé : privilège insuffisant' });
      }

      // Récupérer le statut initial du workflow
      const template = await TemplateModel.findById(project.template);
      const initialWorkflow = await WorkFlowModel.findById(template.workflows?.[0]);
      const initialStatus = initialWorkflow.status;
      if (!initialStatus) {
        return res.status(400).json({ message: 'Workflow non configuré' });
      }

      const task = new TaskModel({
        ...data,
        status: initialStatus,
        projectId,
        history: [
          {
            userId,
            field: 'status',
            oldValue: null,
            newValue: initialStatus,
          },
        ],
      });

      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  public updateTaskStatus = async (req: RequestWithUser, res: Response) => {
    try {
      const { taskId } = req.params;
      const { newStatus, comment, gitLink, ...payload } = req.body;
      const workflow = Container.get(WorkFlowService);

      const task = await TaskModel.findById(taskId);
      if (!task) return res.status(404).json({ message: 'Tâche introuvable' });

      const project = await ProjectModel.findById(task.projectId);
      if (!project) return res.status(404).json({ message: 'Projet introuvable' });

      const userRoles = project.members.find(m => m.userId.toString() === req.user!._id.toString())?.roles || [];

      // Vérifier si la transition est autorisée
      const isAllowed = await workflow.validateTransition(
        taskId,
        newStatus,
        userRoles.map(r => r.toString()),
      );
      if (!isAllowed) {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé à effectuer cette transition" });
      }

      // Valider les données selon le workflow (required fields, conditions, etc.)
      const validation = await workflow.validateTaskData(task, newStatus, { ...task.toObject(), ...req.body });
      if (!validation.success) {
        return res.status(400).json({ message: 'Validation échouée', errors: validation.error });
      }

      // Log de l'historique
      task.history.push({
        timestamp: new Date(), // ✅ Ajout du timestamp
        userId: req.user!._id,
        field: 'status',
        oldValue: task.status,
        newValue: newStatus,
        comment,
      });

      // Gérer les effets spécifiques (ex: gitLink requis pour certains statuts)
      if (newStatus === 'EN_ATTENTE_DE_BUILD' && gitLink) {
        task.gitLink = gitLink;
      }

      // Appliquer la transition via le workflow
      await workflow.applyTransition(
        taskId,
        newStatus,
        userRoles.map(r => r.toString()),
        req.body,
      );

      // Recharger la tâche mise à jour et la renvoyer
      const updatedTask = await TaskModel.findById(taskId);
      res.json(updatedTask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  public getTaskDetails = async (req: Request, res: Response) => {
    try {
      const task = await TaskModel.findById(req.params.taskId).populate('assignees', 'username email').populate('projectId', 'name workflow');

      if (!task) return res.status(404).json({ message: 'TaskModel not found' });

      res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
}*/

import { Request, Response } from 'express';
import Container from 'typedi';
import { TaskService } from '@/services/task.service';
import { RequestWithUser } from '@/interfaces/auth.interface';

export class TaskController {
  private taskService = Container.get(TaskService);

  public createTask = async (req: RequestWithUser, res: Response) => {
    try {
      const task = await this.taskService.createTask(req.user!._id, req.params.projectId, req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  public updateTaskStatus = async (req: RequestWithUser, res: Response) => {
    try {
      const { taskId } = req.params;
      const { newStatus, comment, ...payload } = req.body;

      const updatedTask = await this.taskService.updateStatus(taskId, req.user!._id, newStatus, comment, payload);

      res.json(updatedTask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  public getTaskDetails = async (req: Request, res: Response) => {
    try {
      const task = await this.taskService.getTaskById(req.params.taskId);
      if (!task) return res.status(404).json({ message: 'Tâche introuvable' });
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
