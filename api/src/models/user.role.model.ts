import { model, Schema, Document } from 'mongoose';
import { IUserRole } from '@/interfaces/user.role.interface';

const UserRoleSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Global', 'Project'],
    required: true,
  },
  projectId: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: false,
    },
  ],
  roleId: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
  ],
  privId: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Privilege',
      required: false,
    },
  ],
});

export const UserRoleModel = model<IUserRole & Document>('UserRole', UserRoleSchema);
