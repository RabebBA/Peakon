import { model, Schema, Document } from 'mongoose';
import { IComment } from '@interfaces/comment.interface';

const CommentSchema: Schema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    PieceJt: {
      type: [String], // Stocke l'URL ou le chemin du fichier
      validate: {
        validator: function (v: string[]) {
          return v.every(file => /\.(pdf|zip|png)$/i.test(file)); // Vérification des extensions
        },
        message: 'Seuls les fichiers PDF, ZIP, PNG sont autorisés.',
      },
      required: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }, // Ajoute automatiquement createdAt et updatedAt
);

export const CommentModel = model<IComment & Document>('Comment', CommentSchema);
