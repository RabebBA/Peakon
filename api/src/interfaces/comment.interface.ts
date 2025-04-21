import { IUser } from './users.interface';
import { ITask } from './task.interface';

export interface IComment {
  _id?: string;
  text: string;
  pieceJt?: string[];
  user: IUser['_id'];
  task: ITask['_id'];
  createdAt?: Date;
  updatedAt?: Date;
  mentions?: {
    user: IUser['_id'];
  }[];
  replies?: IComment[];
  isVisible?: boolean;
}
