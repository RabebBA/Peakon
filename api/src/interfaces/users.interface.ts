import { Document } from 'mongoose';
import { IRole } from './role.interface';
import { IPrivilege } from './privilege.interface';

export interface IUser extends Document {
  _id?: string;
  firstname: string;
  lastname: string;
  matricule: string;
  roleId: IRole['_id'][]; //Roles globeaux
  privId: IPrivilege['_id'][]; //Privileges globeaux
  job: string; //description of the job in a socity, ex: Human Resources or FullStack Web Developer
  email: string;
  password: string;
  phone?: Number;
  photo?: string;
  isConnected?: Boolean;
  isActive?: Boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}
