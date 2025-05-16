import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { IWorkFlow } from '@interfaces/workflow.interface';
import { WorkFlowModel } from '@models/workflow.model';
import { ProjectModel } from '@/models/project.model';
import { ITask } from '@/interfaces/task.interface';
import { AuditService } from './audit.service';
import { WsGateway } from './wsGateway';
import { TaskModel } from '@/models/task.model';
import { ITransition } from '@/interfaces/transition.interface';
import { UserModel } from '@/models/users.model'; // Assurez-vous d'importer le modèle utilisateur
import { ConditionalSchemaFactory } from '@middlewares/conditionalSchema';
import { TemplateModel } from '@/models/template.model';
import { StatusModel } from '@/models/status.model';
import { RoleModel } from '@/models/role.model';

@Service()
export class WorkFlowService {
  private auditService: AuditService;
  private wsGateway: WsGateway;

  constructor(auditService: AuditService, wsGateway: WsGateway) {
    this.auditService = auditService;
    this.wsGateway = wsGateway;
  }

  // Obtenir tous les workflows
  public findAllWorkFlows = async (): Promise<IWorkFlow[]> => {
    return WorkFlowModel.find();
  };

  // Obtenir un workflow par ID
  public async findWorkFlowById(workflowId: string): Promise<IWorkFlow> {
    const workflow = await WorkFlowModel.findById(workflowId);
    if (!workflow) throw new HttpException(404, 'Workflow not found');
    return workflow;
  }

  // Créer un nouveau workflow
  /* public async createWorkFlow(data: IWorkFlow): Promise<IWorkFlow> {
    // Vérifier le statut source
    const sourceStatus = await StatusModel.findById(data.status);
    if (!sourceStatus) {
      throw new Error(`Statut source introuvable : ${data.status}`);
    }

    // Vérification des transitions
    for (const transition of data.transitions) {
      const targetStatus = await StatusModel.findById(transition.targetStatus);
      if (!targetStatus) {
        throw new Error(`Statut de transition introuvable : ${transition.targetStatus}`);
      }

      if (transition.allowedRoles && transition.allowedRoles.length > 0) {
        const roles = await RoleModel.find({ _id: { $in: transition.allowedRoles }, type: 'Project' });
        if (roles.length !== transition.allowedRoles.length) {
          throw new Error(`Certains rôles de transition sont introuvables.`);
        }
      }

      if (transition.notifRoles && transition.notifRoles.length > 0) {
        const roles = await RoleModel.find({ _id: { $in: transition.allowedRoles }, type: 'Project' });
        if (roles.length !== transition.allowedRoles.length) {
          throw new Error(`Certains rôles de notification sont introuvables.`);
        }
      }
    }

    // Création du workflow
    return await WorkFlowModel.create(data);
  }

  public async createManyWorkFlows(dataList: IWorkFlow[]): Promise<IWorkFlow[]> {
    const results: IWorkFlow[] = [];

    await Promise.all(
      dataList.map(async data => {
        // Vérifier le statut source
        const sourceStatus = await StatusModel.findById(data.status);
        if (!sourceStatus) {
          throw new Error(`Statut source introuvable : ${data.status}`);
        }

        // Vérification des transitions
        for (const transition of data.transitions) {
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

        const created = await WorkFlowModel.create(data);
        results.push(created);
      }),
    );

    return results;
  }

  // Mettre à jour un workflow
  public async updateWorkFlow(workflowId: string, data: Partial<IWorkFlow>): Promise<IWorkFlow> {
    const updated = await WorkFlowModel.findByIdAndUpdate(workflowId, data, {
      new: true,
    });
    if (!updated) throw new HttpException(404, 'Workflow not found');
    return updated;
  }

  // Supprimer un workflow
  public async deleteWorkFlow(workflowId: string): Promise<IWorkFlow> {
    const deleted = await WorkFlowModel.findByIdAndDelete(workflowId);
    if (!deleted) throw new HttpException(404, 'Workflow not found');
    return deleted;
  }

  // Gérer les effets secondaires après une transition
  /*async handleSideEffects(task: ITask, transition: ITansition): Promise<void> {
    // Exemple d'effet secondaire : mise à jour d'un champ dans la tâche
    if (transition.targetStatus === 'En attente de build') {
      task.gitLink = 'https://git.example.com';
      await task.save();
    }
  }*/

  /*public async transitionTask(
    taskId: string,
    transition: ITansition,
    currentUserId: string,
    targetStatusId: string,
    userRoleIds: string[],
    payload: any = {},
  ): Promise<void> {
    const task = await TaskModel.findById(taskId);
    if (!task) throw new Error('Tâche introuvable');
    // await this.handleSideEffects(task, transition);

    // Récupérer l'utilisateur complet en fonction de currentUserId
    const currentUser = await UserModel.findById(currentUserId);
    if (!currentUser) throw new Error('User not found');

    // Journalisation d'audit avec l'objet utilisateur
    await this.auditService.logTransition(task, transition, currentUser);

    // Notification temps réel
    this.wsGateway.broadcastTransition(task, transition);

    await this.applyTransition(taskId, targetStatusId, userRoleIds, payload);
  }

  public async validateTaskData(task: ITask, newStatus: string, data: any) {
    try {
      // Récupérer le projet associé à la tâche
      const project = await ProjectModel.findById(task.projectId);
      if (!project) throw new Error('Projet introuvable');

      // Récupérer le template du projet
      const template = await TemplateModel.findById(project.template);
      if (!template) throw new Error('Template du projet introuvable');

      // Récupérer les workflows associés au template
      const workflows = await WorkFlowModel.find({ _id: { $in: template.workflows } });
      if (!workflows || workflows.length === 0) throw new Error('Aucun workflow trouvé pour ce template');

      // Trouver le workflow qui contient le meme statut similaire au statut actuel de la tâche
      const workflowsStep = workflows.find(s => s.status.toString() === task.status.toString());
      if (!workflowsStep) throw new Error('Étape de workflow introuvable pour le statut actuel de la tâche');

      // Trouver la transition pour le nouveau statut
      const transition = workflowsStep.transitions.find(t => t.targetStatus.toString() === newStatus);
      if (!transition) throw new Error('ITansition non autorisée');

      // Créer le schéma de validation à partir des conditions de transition
      const schema = ConditionalSchemaFactory.create(newStatus, transition.conditions);
      if (!schema) throw new Error('Schéma de validation introuvable');

      // Valider les données selon le schéma généré
      const validationResult = schema.safeParse(data);
      if (!validationResult.success) {
        throw new Error('Données invalides : ' + validationResult.error.message);
      }

      // Si tout est valide, renvoyer le résultat de la validation
      return validationResult;
    } catch (error) {
      throw new Error(`Erreur lors de la validation des données de la tâche : ${error.message}`);
    }
  }

  //Récupérer les roles ayant la possibilité de manipuler une tache
  /* public async validateTransition(taskId: string, targetStatusId: string, userRoleIds: string[]): Promise<boolean> {
    const task = await TaskModel.findById(taskId).populate('status project');
    if (!task) throw new Error('Tâche introuvable');

    const templateId = task.projectId?.template;
    if (!templateId) throw new Error('Le projet de la tâche ne contient pas de template');

    const template = await TemplateModel.findById(templateId);
    if (!template) throw new Error('Template introuvable');

    const workflow = await WorkFlowModel.findOne({
      status: task.status._id,
      _id: { $in: template.workflows },
    });

    if (!workflow) throw new Error('Aucun workflow défini pour ce statut dans le template du projet');

    const transition = workflow.transitions.find(t => t.targetStatus.toString() === targetStatusId);
    if (!transition) return false;

    const isAllowed = transition.allowedRoles.some(role => userRoleIds.includes(role.toString()));

    return isAllowed;
  }

  async applyTransition(taskId: string, targetStatusId: string, userRoleIds: string[], payload: any = {}): Promise<void> {
    const isValid = await this.validateTransition(taskId, targetStatusId, userRoleIds);
    if (!isValid) throw new Error('ITansition non autorisée');
    const task = await TaskModel.findById(taskId);
    const workflow = await WorkFlowModel.findOne({ status: task.status, 'transitions.targetStatus': targetStatusId });
    const transition = workflow?.transitions.find(t => t.targetStatus.toString() === targetStatusId);

    // Vérification des conditions personnalisées (champs requis, validationSchema)
    if (transition?.conditions?.requiredFields?.length) {
      const missingFields = transition.conditions.requiredFields.filter(field => !(field in payload));
      if (missingFields.length) {
        throw new Error(`Champs requis manquants : ${missingFields.join(', ')}`);
      }
    }

    // TODO: Valider le `validationSchema` si besoin (ex: via Ajv ou Joi)

    await TaskModel.findByIdAndUpdate(taskId, { status: targetStatusId });
  }

  async getAvailableTransitions(taskId: string, userRoleIds: string[]) {
    const task = await TaskModel.findById(taskId).populate('status');
    if (!task) throw new Error('Tâche introuvable');

    const workflow = await WorkFlowModel.findOne({ status: task.status._id }).populate('transitions.targetStatus');
    if (!workflow) return [];

    return workflow.transitions.filter(transition => transition.allowedRoles.some(role => userRoleIds.includes(role.toString())));
  }

  async getNextStatuses(taskId: string, userRoleIds: string[]) {
    const transitions = await this.getAvailableTransitions(taskId, userRoleIds);
    return transitions.map(t => t.targetStatus);
  }*/
}
