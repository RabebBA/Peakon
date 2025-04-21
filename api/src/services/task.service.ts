import { Service } from 'typedi';
import { TaskModel } from '@/models/task.model';
import { ProjectModel } from '@/models/project.model';
import { RouteModel } from '@/models/route.model';
import { RoleModel } from '@/models/role.model';
import { PrivilegeModel } from '@/models/privilege.model';
import { WorkFlowModel } from '@/models/workflow.model';
import { TemplateModel } from '@/models/template.model';
import { WorkFlowService } from './workflow.service';
import { ITask } from '@/interfaces/task.interface';
import { TaskSchema } from '@/dtos/task.dto';

@Service()
export class TaskService {
  constructor(private workflowService: WorkFlowService) {}

  async createTask(userId: string, projectId: string, rawData: any): Promise<ITask> {
    const data = TaskSchema.parse(rawData);

    const project = await ProjectModel.findById(projectId).populate('members.roles').populate('members.privileges');
    if (!project) throw new Error('Projet introuvable');

    const member = project.members.find(m => m.userId.toString() === userId.toString());
    if (!member) throw new Error('Utilisateur non membre du projet');

    const routeSignature = 'POST /projects/:projectId/tasks';
    const route = await RouteModel.findOne({ endPoint: routeSignature });
    if (!route) throw new Error('Route non enregistrée');

    const routeId = route._id;
    const hasPrivilegeViaRole = await RoleModel.exists({
      _id: { $in: member.roles },
      privId: routeId,
      $or: [{ type: 'Global' }, { type: 'Project', projectId }],
    });

    const privileges = await PrivilegeModel.find({ _id: { $in: member.privileges } });
    const hasDirectPrivilege = privileges.some(priv => priv.routeId === routeId);

    if (!hasPrivilegeViaRole && !hasDirectPrivilege) {
      throw new Error('Privilèges insuffisants');
    }

    const template = await TemplateModel.findById(project.template);
    const initialWorkflow = await WorkFlowModel.findById(template?.workflows?.[0]);
    if (!initialWorkflow || !initialWorkflow.status) {
      throw new Error('Workflow non configuré');
    }

    const task = new TaskModel({
      ...data,
      status: initialWorkflow.status,
      projectId,
      history: [
        {
          userId,
          field: 'status',
          oldValue: null,
          newValue: initialWorkflow.status,
          timestamp: new Date(),
        },
      ],
    });

    return await task.save();
  }

  async updateStatus(taskId: string, userId: string, newStatus: string, comment: string, payload: any): Promise<ITask> {
    const task = await TaskModel.findById(taskId);
    if (!task) throw new Error('Tâche introuvable');

    const project = await ProjectModel.findById(task.projectId);
    if (!project) throw new Error('Projet introuvable');

    const member = project.members.find(m => m.userId.toString() === userId.toString());
    const userRoles = member?.roles?.map(r => r.toString()) || [];

    const isAllowed = await this.workflowService.validateTransition(taskId, newStatus, userRoles);
    if (!isAllowed) throw new Error("Vous n'êtes pas autorisé à effectuer cette transition");

    const validation = await this.workflowService.validateTaskData(task, newStatus, {
      ...task.toObject(),
      ...payload,
    });

    if (!validation.success) {
      throw new Error(`Validation échouée : ${validation.error}`);
    }

    task.history.push({
      timestamp: new Date(),
      userId,
      field: 'status',
      oldValue: task.status,
      newValue: newStatus,
      comment,
    });

    if (newStatus === 'EN_ATTENTE_DE_BUILD' && payload.gitLink) {
      task.gitLink = payload.gitLink;
    }

    await this.workflowService.applyTransition(taskId, newStatus, userRoles, payload);

    return await TaskModel.findById(taskId);
  }

  async getTaskById(taskId: string): Promise<ITask | null> {
    return TaskModel.findById(taskId).populate('assignees', 'username email').populate('projectId', 'name workflow');
  }
}
