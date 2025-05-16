import { Service } from 'typedi';
import { ITask } from '@/interfaces/task.interface';
import { Transition } from '@/interfaces/transition.interface'; // Assurez-vous d'avoir défini l'interface Transition
import { IUser } from '@/interfaces/users.interface';
import { AuditLogModel } from '@/models/auditLog.model'; // Modèle de log d'audit

@Service()
export class AuditService {
  // Méthode pour enregistrer la transition dans les logs d'audit
  public async logTransition(task: ITask, transition: Transition, user: IUser): Promise<void> {
    const logEntry = new AuditLogModel({
      taskId: task._id,
      userId: user._id,
      oldStatus: task.status,
      newStatus: transition.targetStatus,
      timestamp: new Date(),
    });

    await logEntry.save();
  }
}
