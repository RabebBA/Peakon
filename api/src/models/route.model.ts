import { model, Schema, Document } from 'mongoose';
import { IRoute } from '@/interfaces/route.interface';

const RouteSchema: Schema = new Schema({
  endPoint: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
});

export const RouteModel = model<IRoute & Document>('Route', RouteSchema);
