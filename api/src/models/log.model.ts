import { model, Schema, Document } from 'mongoose';
import { ILog } from '@interfaces/log.interface';

const LogSchema: Schema = new Schema({
  action: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: 'Status',
  },
});

export const LogModel = model<ILog & Document>('Log', LogSchema);
