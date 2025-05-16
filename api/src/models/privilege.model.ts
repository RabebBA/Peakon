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
    enum: ['Global', 'Project', 'AdminSys'],
    required: true,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
});

export const PrivilegeModel = model<IPrivilege & Document>('Privilege', PrivilegeSchema);
