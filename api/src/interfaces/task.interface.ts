// interfaces/task.interface.ts
import { Document } from 'mongoose';
import { IProject } from './project.interface';
import { IUser } from './users.interface';
import { IStatus } from './status.interface';

export enum DemandType {
  RETOUR_CLIENT = 'Retour client',
  TEST_INTERNE = 'Test interne',
  DEVELOPPEMENT = 'Développement',
  URGENCE = 'Urgence',
}

export interface TaskHistoryEntry {
  timestamp: Date;
  userId: string;
  field: string;
  oldValue: any;
  newValue: any;
  comment?: string;
}

export interface ITask extends Document {
  _id: string;
  title: string;
  demandType: DemandType;
  criteria: string[];
  pieceJt?: string[];
  priority: 'Élevée' | 'Faible' | 'Néant';
  version: 'Web' | 'Mobile';
  rubrique: string;
  numTask: string;
  creatDate: Date;
  receptDate: Date;
  projectId: IProject;
  usersId: IUser[];
  status: IStatus;
  gitLink?: string;
  history: TaskHistoryEntry[];
}
