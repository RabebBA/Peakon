import { model, Schema, Document } from 'mongoose';
import { ITransition } from '@/interfaces/transition.interface';

const TransitionSchema: Schema = new Schema({
  targetStatus: {
    type: Schema.Types.ObjectId,
    ref: 'Status',
    required: true,
  },
  allowedRoles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Role',
    },
  ],
  notifRoles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Role',
    },
  ],
  conditions: {
    requiredFields: [
      {
        field: { type: String },
        type: { type: String, default: 'text' },
        options: { type: [String], default: [] },
        isRequired: { type: Boolean, default: false },
      },
    ],
    validationSchema: { type: Object }, // tu peux le laisser comme ça si c’est bien du JSONSchema7
  },
});

export const TransitionModel = model<ITransition & Document>('Transition', TransitionSchema);
