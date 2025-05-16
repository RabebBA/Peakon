import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { IProject } from '@interfaces/project.interface';
import { ProjectModel } from '@models/project.model';
import { IWorkFlow } from '@/interfaces/workflow.interface';
import { WorkFlowModel } from '@/models/workflow.model';
import { TemplateModel } from '@/models/template.model';
import { RoleModel } from '@/models/role.model';
import { PrivilegeModel } from '@/models/privilege.model';

@Service()
export class ProjectService {
  public async findAllProject(): Promise<IProject[]> {
    return await ProjectModel.find({ isArchived: false });
  }

  public async findArchivedProjects(): Promise<IProject[]> {
    return await ProjectModel.find({ isArchived: true });
  }

  public async findProjectById(projectId: string): Promise<IProject> {
    const project = await ProjectModel.findById(projectId);
    if (!project) throw new HttpException(404, "Project doesn't exist");
    return project;
  }

  public async createProject(userId: string, projectData: IProject): Promise<IProject> {
    const existing = await ProjectModel.findOne({ name: projectData.name });
    if (existing) throw new HttpException(409, `Project name '${projectData.name}' already exists`);

    const template = await TemplateModel.findById(projectData.template);
    if (!template) throw new HttpException(400, 'Invalid template ID');

    // ✅ Vérification des types de rôles et privilèges
    for (const member of projectData.members) {
      const roles = await RoleModel.find({ _id: { $in: member.roles } });

      const invalidRoles = roles.filter(role => role.type !== 'Project');
      if (invalidRoles.length > 0) {
        throw new HttpException(400, `Invalid role type for roles: ${invalidRoles.map(r => r.title).join(', ')}`);
      }
    }

    const project = new ProjectModel({
      ...projectData,
      createdBy: userId,
    });

    return await project.save();
  }

  public async updateProject(userId: string, projectId: string, projectData: IProject): Promise<IProject> {
    const existingProject = await ProjectModel.findById(projectId);
    if (!existingProject) throw new HttpException(404, 'Project not found');

    const duplicate = await ProjectModel.findOne({ name: projectData.name });
    if (duplicate && duplicate._id.toString() !== projectId) {
      throw new HttpException(409, `Project name '${projectData.name}' already exists`);
    }

    const template = await TemplateModel.findById(projectData.template).populate('workflows');
    if (!template) throw new HttpException(400, 'Invalid template ID');

    const workflows: IWorkFlow[] = await WorkFlowModel.find({ _id: { $in: template.workflows } });
    const statusSet = new Set(workflows.map(w => w.status.toString()));

    existingProject.name = projectData.name || existingProject.name;
    existingProject.desc = projectData.desc || existingProject.desc;
    existingProject.deliveryDate = projectData.deliveryDate || existingProject.deliveryDate;
    existingProject.template = projectData.template || existingProject.template;
    existingProject.members = projectData.members || existingProject.members;

    return await existingProject.save();
  }

  /*public async deleteProject(projectId: string): Promise<IProject> {
    const project = await ProjectModel.findByIdAndDelete(projectId);
    if (!project) throw new HttpException(404, "Project doesn't exist");
    return project;
  }*/

  public async archiveProject(projectId: string): Promise<IProject> {
    const project = await ProjectModel.findById(projectId);
    if (!project) throw new HttpException(404, "Project doesn't exist");

    if (project.isArchived) throw new HttpException(400, 'Project is already archived');

    project.isArchived = true;
    return await project.save();
  }

  public async unarchiveProject(projectId: string): Promise<IProject> {
    const project = await ProjectModel.findById(projectId);
    if (!project) throw new HttpException(404, "Project doesn't exist");

    if (!project.isArchived) throw new HttpException(400, 'Project is not archived');

    project.isArchived = false;
    return await project.save();
  }

  /*public static async getWorkflow(projectId: string): Promise<
    {
      status: string;
      transitions: { target: string; allowedRoles: string[] }[];
    }[]
  > {
    const project = await ProjectModel.findById(projectId).populate('members.userId', 'username email');
    if (!project) throw new HttpException(404, 'Project not found');
    const template = await TemplateModel.findById(project.template);

    if (!Array.isArray(template.workflows)) {
      throw new HttpException(400, 'Invalid project workflows');
    }

    const workflows: IWorkFlow[] = await WorkFlowModel.findById(template.workflows);
    return workflows.map(step => ({
      status: step.status.toString(),
      transitions: Array.isArray(step.transitions)
        ? step.transitions.map(t => ({
            target: t.targetStatus.toString(),
            allowedRoles: t.allowedRoles?.map(role => role.toString()) || [],
          }))
        : [],
    }));
  }*/
}
