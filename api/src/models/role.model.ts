import { model, Schema, Document } from 'mongoose';
import { IRole } from '@/interfaces/role.interface';
import { ProjectModel } from './project.model';
import { UserModel } from './users.model';

const RoleSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Global', 'Project'],
      required: true,
    },
    privId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Privilege',
        required: true,
      },
    ],
    projectId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: false,
        validate: {
          validator: async function (projectId: Schema.Types.ObjectId) {
            return await ProjectModel.exists({ _id: projectId });
          },
          message: 'Le projet n’existe pas.',
        },
      },
    ],
    isEnable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // ✅ Active createdAt et updatedAt
  },
);

export const RoleModel = model<IRole & Document>('Role', RoleSchema);
