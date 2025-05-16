import { model, Schema, Document } from 'mongoose';
import { ITemplate } from '@/interfaces/template.interface';

const TemplateSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workflows: [
      {
        type: Schema.Types.ObjectId,
        ref: 'WorkFlow',
        required: true,
      },
    ],
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
      },
    ],
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const TemplateModel = model<ITemplate & Document>('Template', TemplateSchema);
