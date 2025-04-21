import { model, Schema, SchemaType } from 'mongoose';
import { IUser } from '@interfaces/users.interface';

const UserSchema = new Schema<IUser>({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  matricule: {
    type: String,
    required: true,
    unique: true,
  },
  roleId: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
  ],
  privId: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Privilege',
    },
  ],
  job: {
    //description of the job in a socity, ex: Human Resources or FullStack Web Developer
    type: String,
    required: true,
    maxlength: 500,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  phone: {
    type: Number,
  },
  photo: {
    type: String,
    required: false,
  },
  isConnected: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  resetPasswordToken: {
    type: String,
    required: false,
  },
  resetPasswordExpires: {
    type: Number,
    required: false,
  },
});

export const UserModel = model<IUser>('User', UserSchema);
