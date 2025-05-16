import { IWorkFlow } from '@interfaces/workflow.interface';
import { Schema, Document, model } from 'mongoose';

const WorkFlowSchema: Schema = new Schema({
  status: {
    type: Schema.Types.ObjectId,
    ref: 'Status',
    required: true,
  },
  transitions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Transition',
    },
  ],
});

export const WorkFlowModel = model<IWorkFlow & Document>('WorkFlow', WorkFlowSchema);
