import { DemandType } from '@interfaces/task.interface';
import { z } from 'zod';

export const TaskBaseSchema = z.object({
  title: z.string().min(5, 'Le titre doit comporter au moins 5 caractères'),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  criteria: z.array(z.string().min(5)).min(3),
  createdAt: z.date().default(() => new Date()),
  dueDate: z.date().optional(),
  status: z.string().min(1, 'Le statut doit être renseigné'),
  assignee: z.string().uuid().optional(),
});

export const TaskSchema = TaskBaseSchema.extend({
  demandType: z.enum([DemandType.RETOUR_CLIENT, DemandType.TEST_INTERNE, DemandType.DEVELOPPEMENT, DemandType.URGENCE]),
  criteria: z.array(z.string().min(5)).min(3), // Validation pour les critères
  pieceJt: z.array(z.string().url()).optional(), // Pièces jointes (URLs)
  priority: z.enum(['Faible', 'Élevée', 'Néant']), // Priorité de la tâche
  version: z.enum(['Web', 'Mobile']), // Version de la tâche
  rubrique: z.string().min(3), // Rubrique de la tâche
  numTask: z.string().min(3), // Numéro de la tâche
  creatDate: z.date(), // Date de création
  receptDate: z.date(), // Date de réception
  project: z.object({ _id: z.string().uuid() }), // Projet associé à la tâche (ici, l'ID du projet est validé)
  users: z.array(z.object({ _id: z.string().uuid() })), // Liste des utilisateurs associés à la tâche
  status: z.object({ _id: z.string().uuid() }), // Statut de la tâche
  gitLink: z.string().url().optional(), // Lien Git (facultatif)
});
