import { model, Schema, Document } from 'mongoose';
import { IProject } from '@interfaces/project.interface';

const ProjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
      },
    ],
    desc: {
      type: String,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    deliveryDate: {
      type: Date,
      required: true,
    },
    template: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const ProjectModel = model<IProject & Document>('Project', ProjectSchema);
