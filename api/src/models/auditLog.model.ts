import { model, Schema, Document } from 'mongoose';
import { ObjectId } from 'mongoose';

// Définir l'interface pour le modèle de log d'audit
export interface IAuditLog extends Document {
  taskId: ObjectId;
  userId: ObjectId;
  oldStatus: string;
  newStatus: string;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema({
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  oldStatus: {
    type: String,
    required: true,
  },
  newStatus: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// Créer le modèle pour les logs d'audit
export const AuditLogModel = model<IAuditLog>('AuditLog', AuditLogSchema);
