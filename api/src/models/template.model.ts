import { model, Schema, Document } from 'mongoose';
import { ITemplate } from '@/interfaces/template.interface';

const TemplateSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  workflows: [
    {
      type: Schema.Types.ObjectId,
      ref: 'WorkFlow',
      required: true,
    },
  ],
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: false,
  },
});

export const TemplateModel = model<ITemplate & Document>('Template', TemplateSchema);
