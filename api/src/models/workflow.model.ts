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
      targetStatus: {
        type: Schema.Types.ObjectId,
        ref: 'Status',
        required: true,
      },
      allowedRoles: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Role',
          required: true,
        },
      ],
      conditions: {
        requiredFields: [{ type: String }],
        validationSchema: { type: String }, // Stocké sous forme de string JSON
      },
    },
  ],
});

export const WorkFlowModel = model<IWorkFlow & Document>('WorkFlow', WorkFlowSchema);
