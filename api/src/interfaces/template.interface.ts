import { IProject } from './project.interface';
import { IWorkFlow } from './workflow.interface';

export interface ITemplate {
  _id?: string;
  name: string;
  workflows: IWorkFlow['_id'][];
  projectId: IProject['_id'];
}
