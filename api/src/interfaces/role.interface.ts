import { IProject } from './project.interface';
import { IUser } from './users.interface';
import { IPrivilege } from './privilege.interface';

export interface IRole {
  _id?: string;
  title: string;
  type: 'Global' | 'Project';
  privId: IPrivilege['_id'][];
  projectId?: IProject['_id'][];
  isEnable: boolean;
}
