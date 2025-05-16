import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { IPrivilege } from '@/interfaces/privilege.interface';
import { PrivilegeModel } from '@/models/privilege.model';

@Service()
export class PrivilegeService {
  // Trouver les privilèges de type 'Project'
  public async findProjectPrivilege(): Promise<IPrivilege[]> {
    return await PrivilegeModel.find({
      type: 'Project',
      $or: [
        { projectId: { $exists: true, $size: 0 } },
        { projectId: { $exists: false } },
        { userId: { $exists: true, $size: 0 } },
        { userId: { $exists: false } },
      ],
    }).exec();
  }

  // Trouver les privilèges de type 'Global'
  public async findGlobalPrivilege(): Promise<IPrivilege[]> {
    return await PrivilegeModel.find({
      type: 'Global',
      $or: [
        { projectId: { $exists: true, $size: 0 } },
        { projectId: { $exists: false } },
        { userId: { $exists: true, $size: 0 } },
        { userId: { $exists: false } },
      ],
    }).exec();
  }

  public async findPrivilegeById(privilegeId: string): Promise<IPrivilege> {
    const privilege = await PrivilegeModel.findById(privilegeId);
    if (!privilege) throw new HttpException(404, 'Privilege not found');
    return privilege;
  }

  public async findAllPrivileges(): Promise<IPrivilege[]> {
    return await PrivilegeModel.find().exec();
  }

  public async createPrivilege(data: IPrivilege): Promise<IPrivilege> {
    const existingPrivilege = await PrivilegeModel.findOne({
      routeId: data.routeId,
    });
    if (existingPrivilege) throw new HttpException(409, 'Privilege already exists');

    return await PrivilegeModel.create(data);
  }

  public async createPrivileges(data: IPrivilege[]): Promise<IPrivilege[]> {
    // Filtrage des doublons potentiels avant création
    const routeIds = data.map(d => d.routeId);
    const existing = await PrivilegeModel.find({ routeId: { $in: routeIds } });

    const existingRouteIds = new Set(existing.map(p => p.routeId.toString()));
    const newPrivileges = data.filter(p => !existingRouteIds.has(p.routeId.toString()));

    if (newPrivileges.length === 0) {
      throw new HttpException(409, 'All privileges already exist');
    }

    return await PrivilegeModel.insertMany(newPrivileges);
  }

  public async updatePrivilege(privilegeId: string, data: Partial<IPrivilege>): Promise<IPrivilege> {
    const updatedPrivilege = await PrivilegeModel.findByIdAndUpdate(privilegeId, data, { new: true });
    if (!updatedPrivilege) throw new HttpException(404, 'Privilege not found');
    return updatedPrivilege;
  }

  public async deletePrivilege(privilegeId: string): Promise<IPrivilege> {
    const deletedPrivilege = await PrivilegeModel.findByIdAndDelete(privilegeId);
    if (!deletedPrivilege) throw new HttpException(404, 'Privilege not found');
    return deletedPrivilege;
  }
}
