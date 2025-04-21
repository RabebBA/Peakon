import { IUser } from './users.interface';
import { ITemplate } from './template.interface';
import { IRole } from './role.interface';
import { IPrivilege } from './privilege.interface';

export interface IProject {
  _id?: string;
  name: string;
  members: {
    userId: IUser['_id'];
    roles: IRole['_id'][]; // Rôles spécifiques au projet
    privileges: IPrivilege['_id'][]; // Privilèges spécifiques au projet
  }[];
  desc?: string;
  createdBy: IUser['_id'];
  deliveryDate: Date;
  template: ITemplate['_id'];
}
