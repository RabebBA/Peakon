import { Types } from 'mongoose';
import { IStatus } from './status.interface';
import { IRole } from './role.interface';

export interface ITransition {
  _id: string;
  targetStatus: IStatus['_id']; // référence au modèle 'Status'
  allowedRoles: IRole['_id'][]; // références au modèle 'Role'
  notifRoles?: IRole['_id'][]; // nouveaux rôles à notifier

  conditions?: {
    requiredFields?: {
      field: string;
      type?: string; // par défaut 'text'
      options?: string[]; // par défaut []
      isRequired: boolean;
    }[];
    validationSchema?: any; // tu peux utiliser JSONSchema7 si tu veux le typer précisément
  };
}
