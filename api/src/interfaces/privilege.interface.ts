import { IRoute } from './route.interface';
import { IUser } from './users.interface';

export interface IPrivilege {
  _id?: string;
  routeId: IRoute['_id'];
  type: 'Global' | 'Project' | 'AdminSys';
  isVisible: boolean;
}
