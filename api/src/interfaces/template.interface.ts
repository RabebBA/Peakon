import { IRole } from './role.interface';
import { IUser } from './users.interface';
import { IWorkFlow } from './workflow.interface';

export interface ITemplate {
  _id?: string;
  name: string;
  createdBy: IUser['_id'];
  workflows: IWorkFlow['_id'][];
  roles: IRole['_id'][];
  isEnable: boolean;
}
