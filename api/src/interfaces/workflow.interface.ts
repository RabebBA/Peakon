import { IStatus } from './status.interface';
import { IRole } from './role.interface';

export interface IWorkFlow {
  _id: string;
  status: IStatus['_id'];
  transitions: {
    targetStatus: IStatus['_id'];
    allowedRoles?: IRole['_id'][];
    conditions?: {
      requiredFields?: string[];
      validationSchema?: Zod.Schema;
    };
  }[];
}
