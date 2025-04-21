import { IRole } from './role.interface';
import { IProject } from './project.interface';
import { IUser } from './users.interface';
import { IPrivilege } from './privilege.interface';

export interface IUserRole {
  //affecter les role au user pour chaque projet
  //si l'id de projet existe alors role de type projet sinn role globale
  userId: IUser['_id'];
  type: 'Global' | 'Project';
  projectId?: IProject['_id'][];
  roleId: IRole['_id'][];
  privId?: IPrivilege['_id'][];
}
