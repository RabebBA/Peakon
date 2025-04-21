import { StatusModel } from '@/models/status.model';
import { TaskModel } from '@/models/task.model';
import { Types } from 'mongoose';

class TimeTracker {
  async startTimer(taskId: string, userId: string) {
    const task = await TaskModel.findById(taskId).populate('status');
    if (!task) throw new Error('Tâche non trouvée');

    // Vérifier si une autre tâche est en cours pour cet utilisateur
    const activeTask = await TaskModel.findOne({
      assignees: userId,
      status: { $in: await this.getStatusIds(['EN_COURS', 'A_TESTER']) },
    });

    if (activeTask) {
      throw new Error(`Une tâche est déjà en cours (#${activeTask._id})`);
    }

    const newStatus = await StatusModel.findOne({ status: 'EN_COURS' });
    if (!newStatus) throw new Error("Statut 'EN_COURS' introuvable");

    const previousStatus = task.status?.status ?? 'UNKNOWN';
    task.status = newStatus;
    task.history.push({
      timestamp: new Date(),
      userId,
      field: 'timer',
      oldValue: 'STOPPED',
      newValue: 'STARTED',
    });

    await task.save();
    return task;
  }

  async handleAutomaticPauses() {
    const statusToCheck = await this.getStatusIds(['EN_COURS', 'A_TESTER']);

    const tasks = await TaskModel.find({
      status: { $in: statusToCheck },
      updatedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    }).populate('status');

    const pausedStatus = await StatusModel.findOne({ status: 'EN_ATTENTE' });
    if (!pausedStatus) throw new Error("Statut 'EN_ATTENTE' introuvable");

    for (const task of tasks) {
      const oldStatus = task.status?.status ?? 'UNKNOWN';
      task.status = pausedStatus;
      task.history.push({
        timestamp: new Date(),
        userId: 'SYSTEM',
        field: 'status',
        oldValue: oldStatus,
        newValue: 'EN_ATTENTE',
        comment: "Mise en pause automatique après 24h d'inactivité",
      });
      await task.save();
    }
  }

  // 🔧 Méthode utilitaire pour trouver les IDs MongoDB des statuts
  private async getStatusIds(statusNames: string[]): Promise<Types.ObjectId[]> {
    const statuses = await StatusModel.find({ status: { $in: statusNames } });
    return statuses.map(s => s._id);
  }
}

export default new TimeTracker();
