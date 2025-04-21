import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { IRole } from '@/interfaces/role.interface';
import { RoleModel } from '@/models/role.model';
import { PrivilegeModel } from '@/models/privilege.model';

@Service()
export class RoleService {
  // 1. findProjectRole: Récupérer les rôles de type "Project" n'ayant ni projectId ni userId
  public findProjectRoles = (): Promise<IRole[]> => {
    return RoleModel.find({
      type: 'Project',
      $or: [
        { projectId: { $exists: true, $size: 0 } },
        { projectId: { $exists: false } },
        { userId: { $exists: true, $size: 0 } },
        { userId: { $exists: false } },
      ],
    }).exec();
  };

  // 2. findGlobalRole: Récupérer les rôles de type "Global" n'ayant pas userId
  public findGlobalRole = (): Promise<IRole[]> => {
    return RoleModel.find({
      type: 'Global',
      $or: [
        { projectId: { $exists: true, $size: 0 } },
        { projectId: { $exists: false } },
        { userId: { $exists: true, $size: 0 } },
        { userId: { $exists: false } },
      ],
    }).exec();
  };

  // 3. findProjectRolesByProjectId: Récupérer les rôles de type "Project" pour un projet spécifique
  public findProjectRolesByProjectId = (projectId: string): Promise<IRole[]> => {
    return RoleModel.find({ type: 'Project', projectId }).exec();
  };

  // 4. findProjectRoleByUserId: Récupérer les rôles de type "Project" spécifiques à un utilisateur
  public findProjectRoleByUserId = (userId: string): Promise<IRole[]> => {
    return RoleModel.find({ type: 'Project', userId }).exec();
  };

  // 5. findGlobalRoleByUserId: Récupérer les rôles de type "Global" spécifiques à un utilisateur
  public findGlobalRoleByUserId = (userId: string): Promise<IRole[]> => {
    return RoleModel.find({ type: 'Global', userId }).exec();
  };

  // 6. UpdateRole: Met à jour un rôle, crée un nouveau rôle si le projectId[] ou userId[] sont affectés
  public updateRole = async (roleId: string, updateData: Partial<IRole>): Promise<IRole> => {
    // Vérifier si projectId[] ou userId[] sont affectés
    const isAffected = updateData.projectId || updateData.userId;

    if (isAffected) {
      // Créer un nouveau rôle avec les modifications
      const newRole = new RoleModel({
        ...updateData,
        _id: undefined, // Mongoose générera un nouvel ID
      });
      return newRole.save();
    } else {
      // Sinon, mettre à jour le rôle existant
      return RoleModel.findByIdAndUpdate(roleId, updateData, { new: true }).exec();
    }
  };

  public async findRoleById(roleId: string): Promise<IRole | null> {
    const findRole: IRole | null = await RoleModel.findById(roleId);
    if (!findRole) throw new HttpException(404, "Role doesn't exist");
    return findRole;
  }

  public async createRole(data: IRole): Promise<IRole> {
    data.title = data.title.toUpperCase();

    // Construire la requête de recherche pour éviter les doublons
    const query: any = { title: data.title, type: data.type };

    if (data.projectId && data.projectId.length > 0) {
      query.projectId = { $in: data.projectId };
    } else if (data.userId && data.userId.length > 0) {
      query.userId = { $in: data.userId };
    } else {
      // Vérifier qu'il n'existe pas déjà un rôle "Project" sans projectId (pour tous les projets)
      query.projectId = { $exists: false };
      query.userId = { $exists: false };
    }

    const existingRole = await RoleModel.findOne(query);
    if (existingRole) {
      throw new HttpException(409, `A role with title "${data.title}" already exists for this scope`);
    }

    // Vérifier que tous les privilèges correspondent au type du rôle
    const privileges = await PrivilegeModel.find({ _id: { $in: data.privId } });

    if (privileges.length !== data.privId.length) {
      throw new HttpException(400, 'One or more privileges do not exist');
    }

    const invalidPrivileges = privileges.filter(priv => priv.type !== data.type);
    if (invalidPrivileges.length > 0) {
      throw new HttpException(400, `All privileges must be of type "${data.type}"`);
    }

    return await RoleModel.create(data);
  }

  public async deleteRole(roleId: string): Promise<IRole> {
    const deleteRoleById: IRole | null = await RoleModel.findByIdAndDelete(roleId);
    if (!deleteRoleById) throw new HttpException(404, "Role doesn't exist");

    return deleteRoleById;
  }
}
