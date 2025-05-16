import { IStatus } from './status.interface';
import { ITransition } from './transition.interface';

export interface IWorkFlow {
  _id: string;
  status: IStatus['_id'];
  transitions: ITransition['_id'][];
}
