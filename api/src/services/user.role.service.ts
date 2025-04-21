import { Service } from 'typedi';
import { UserRoleModel } from '@/models/user.role.model';
import { IUserRole } from '@/interfaces/user.role.interface';
import { HttpException } from '@/exceptions/httpException';
import { RoleModel } from '@/models/role.model';
import { PrivilegeModel } from '@/models/privilege.model';

@Service()
export class UserRoleService {
  public async findAllUserRoles(): Promise<IUserRole[]> {
    return await UserRoleModel.find().populate('projectId userId roleId');
  }

  public async findUserRoleById(userRoleId: string): Promise<IUserRole> {
    const userRole = await UserRoleModel.findById(userRoleId).populate('projectId userId roleId');
    if (!userRole) throw new HttpException(404, 'User Role not found');
    return userRole;
  }

  public async createUserRole(data: IUserRole): Promise<IUserRole> {
    // Vérification des rôles sélectionnés
    const roles = await RoleModel.find({ _id: { $in: data.roleId } });

    if (roles.length !== data.roleId.length) {
      throw new HttpException(400, 'One or more roles do not exist');
    }

    const invalidRoles = roles.filter(role => role.type !== data.type);
    if (invalidRoles.length > 0) {
      throw new HttpException(400, `All roles must be of type "${data.type}"`);
    }

    // Vérification des privilèges sélectionnés
    if (data.privId && data.privId.length > 0) {
      const privileges = await PrivilegeModel.find({ _id: { $in: data.privId } });

      if (privileges.length !== data.privId.length) {
        throw new HttpException(400, 'One or more privileges do not exist');
      }

      const invalidPrivileges = privileges.filter(priv => priv.type !== data.type);
      if (invalidPrivileges.length > 0) {
        throw new HttpException(400, `All privileges must be of type "${data.type}"`);
      }
    }

    // Création du UserRole après validation
    const newUserRole = await UserRoleModel.create(data);
    return await newUserRole.populate('projectId userId roleId privId');
  }

  public async updateUserRole(userRoleId: string, data: Partial<IUserRole>): Promise<IUserRole> {
    const updatedUserRole = await UserRoleModel.findByIdAndUpdate(userRoleId, data, { new: true }).populate('projectId userId roleId');
    if (!updatedUserRole) throw new HttpException(404, 'User Role not found');
    return updatedUserRole;
  }

  public async deleteUserRole(userRoleId: string): Promise<IUserRole> {
    const deletedUserRole = await UserRoleModel.findByIdAndDelete(userRoleId);
    if (!deletedUserRole) throw new HttpException(404, 'User Role not found');
    return deletedUserRole;
  }
}
