import { model, Schema, Document } from 'mongoose';
import { IPrivilege } from '@/interfaces/privilege.interface';

const PrivilegeSchema: Schema = new Schema({
  routeId: {
    type: Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  type: {
    type: String,
    enum: ['Global', 'Project'],
    required: true,
  },
  userId: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

export const PrivilegeModel = model<IPrivilege & Document>('Privilege', PrivilegeSchema);
