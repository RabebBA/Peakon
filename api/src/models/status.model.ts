import { model, Schema, Document } from 'mongoose';
import { IStatus } from '@interfaces/status.interface';

const StatusSchema: Schema = new Schema({
  status: {
    type: String,
    required: true,
  },
  special: {
    type: String,
    enum: ['Initial', 'Final'],
  },
  isScalable: {
    type: Boolean,
    required: true,
  },
});
export const StatusModel = model<IStatus & Document>('Status', StatusSchema);
