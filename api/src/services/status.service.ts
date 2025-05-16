import { Service } from 'typedi';
import { IStatus } from '@/interfaces/status.interface';
import { StatusModel } from '@/models/status.model'; // à créer (voir plus bas)
import { HttpException } from '@/exceptions/httpException';

@Service()
export class StatusService {
  // 🔍 Récupérer tous les statuts
  public async getAllStatuses(): Promise<IStatus[]> {
    return await StatusModel.find();
  }

  // 🔍 Récupérer un statut par son ID
  public async getStatusById(id: string): Promise<IStatus> {
    const status = await StatusModel.findById(id);
    if (!status) throw new HttpException(404, `Statut avec l'id ${id} introuvable.`);
    return status;
  }

  // ➕ Créer un nouveau statut
  public async createStatus(data: IStatus): Promise<IStatus> {
    const existingStatus = await StatusModel.findOne({
      status: data.status,
    });
    if (existingStatus) throw new HttpException(409, 'Status already exists');
    const createdStatus = new StatusModel(data);
    return await createdStatus.save();
  }

  // ✏️ Mettre à jour un statut
  public async updateStatus(id: string, data: Partial<IStatus>): Promise<IStatus> {
    const updatedStatus = await StatusModel.findByIdAndUpdate(id, data, { new: true });
    if (!updatedStatus) throw new HttpException(404, `Impossible de mettre à jour le statut avec l'id ${id}.`);
    return updatedStatus;
  }

  // ❌ Supprimer un statut
  public async deleteStatus(id: string): Promise<void> {
    const result = await StatusModel.findByIdAndDelete(id);
    if (!result) throw new HttpException(404, `Impossible de supprimer le statut avec l'id ${id}.`);
  }
}
