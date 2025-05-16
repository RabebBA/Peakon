import { Document } from 'mongoose';
import { IRole } from './role.interface';

export interface IUser extends Document {
  _id?: string;
  firstname: string;
  lastname: string;
  matricule: string;
  roleId: IRole['_id'][];
  job: string;
  email: string;
  password: string;
  phone?: Number;
  photo?: string;
  isConnected?: Boolean;
  isActive?: Boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}
