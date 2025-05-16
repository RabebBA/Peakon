import { model, Schema, Document } from 'mongoose';
import { ITask, DemandType } from '@interfaces/task.interface';

const TaskHistorySchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  field: String,
  oldValue: Schema.Types.Mixed,
  newValue: Schema.Types.Mixed,
  comment: String,
});

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 50,
    match: /^[a-zA-Z0-9\s\-]+$/,
  },
  desc: {
    type: String,
  },
  demandType: {
    type: String,
    enum: Object.values(DemandType),
    required: true,
  },
  criteria: {
    type: [String],
    validate: {
      validator: function (v: string[]) {
        return v.length >= 3;
      },
      message: 'Au moins 3 critères d’acceptation sont requis.',
    },
    required: true,
  },
  pieceJt: {
    type: [String],
    validate: {
      validator: function (v: string[]) {
        return v.every(file => /\.(pdf|zip|png)$/i.test(file)); // Vérification des extensions
      },
      message: 'Seuls les fichiers PDF, ZIP, PNG sont autorisés.',
    },
  },
  priority: {
    type: String,
    required: true,
    default: 'Néant',
  },
  version: {
    type: String,
    required: true,
    default: 'Web',
  },
  rubrique: {
    type: String,
    required: true,
  },
  numTask: {
    type: String,
    required: true,
    unique: true,
  },
  creatDate: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  receptDate: {
    type: Date,
    default: Date.now,
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  usersId: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  status: {
    type: Schema.Types.ObjectId,
    ref: 'Status',
    required: true,
  },
  gitLink: {
    type: String,
    required: false,
  },
  history: [TaskHistorySchema],
});

TaskSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  const prefix = this.numTask ? this.numTask.split('-')[0] : 'PROJ';

  if (prefix.length !== 4) {
    return next(new Error('Le préfixe doit contenir exactement 4 caractères.'));
  }

  const lastTask = await TaskModel.findOne({ numTask: new RegExp(`^${prefix}-\\d{3}$`) }).sort({ numTask: -1 });

  const lastNumber = lastTask ? parseInt(lastTask.numTask.split('-')[1]) : 0;
  this.numTask = `${prefix}-${String(lastNumber + 1).padStart(3, '0')}`;

  next();
});

export const TaskModel = model<ITask & Document>('Task', TaskSchema);
