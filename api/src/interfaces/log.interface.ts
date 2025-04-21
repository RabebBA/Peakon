import { IUser } from './users.interface';
import { ITask } from './task.interface';
import { IProject } from './project.interface';
import { IComment } from './comment.interface';
import { IStatus } from './status.interface';

export interface ILog {
  _id?: string;
  action: string;
  user: IUser['_id'];
  project: IProject['_id'];
  task?: ITask['_id'];
  comment?: IComment['_id'];
  status?: IStatus['_id'];
}
