import { Request, Response, NextFunction } from 'express';
import { StatusService } from '@/services/status.service';
import { IStatus } from '@/interfaces/status.interface';
import { Container } from 'typedi';
import { StatusModel } from '@/models/status.model';

export class StatusController {
  private statusService = Container.get(StatusService);

  // Récupérer tous les statuts
  public getAllStatuses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const statuses: IStatus[] = await this.statusService.getAllStatuses();
      res.status(200).json({ data: statuses, message: 'Tous les statuts' });
    } catch (error) {
      next(error);
    }
  };

  // Récupérer un statut par ID
  public getStatusById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const statusId = req.params.id;
      const status: IStatus = await this.statusService.getStatusById(statusId);
      res.status(200).json({ data: status, message: `Statut ${statusId}` });
    } catch (error) {
      next(error);
    }
  };

  // Créer un statut
  public createStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const statusData: IStatus = req.body;
      const created = await this.statusService.createStatus(statusData);
      res.status(201).json({ data: created, message: 'Statut créé' });
    } catch (error) {
      next(error);
    }
  };

  // Mettre à jour un statut
  public updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const statusId = req.params.id;
      const statusData: Partial<IStatus> = req.body;
      const updated = await this.statusService.updateStatus(statusId, statusData);
      res.status(200).json({ data: updated, message: `Statut ${statusId} mis à jour` });
    } catch (error) {
      next(error);
    }
  };

  // Supprimer un statut
  public deleteStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const statusId = req.params.id;
      const status = await StatusModel.findById(statusId);
      await this.statusService.deleteStatus(statusId);
      res.status(200).json({ message: `Statut ${status.status} supprimé` });
    } catch (error) {
      next(error);
    }
  };
}
