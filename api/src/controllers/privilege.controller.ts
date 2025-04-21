import { Request, Response, NextFunction } from 'express';
import { PrivilegeService } from '@/services/privilege.service';
import { IPrivilege } from '@/interfaces/privilege.interface';
import { HttpException } from '@/exceptions/httpException';
import { Container } from 'typedi';

export class PrivilegeController {
  public priv = Container.get(PrivilegeService);

  public getAllProjectPrivilege = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const privileges: IPrivilege[] = await this.priv.findProjectPrivilege();
      res.status(200).json({ data: privileges, message: 'Project Privileges retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getAllGlobalPrivilege = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const privileges: IPrivilege[] = await this.priv.findGlobalPrivilege();
      res.status(200).json({ data: privileges, message: 'Global Privileges retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getPrivilegeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const privilege: IPrivilege | null = await this.priv.findPrivilegeById(id);
      if (!privilege) throw new HttpException(404, 'Privilege not found');

      res.status(200).json({ data: privilege, message: 'Privilege retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public createPrivilege = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const privilegeData: IPrivilege = req.body;
      const newPrivilege: IPrivilege = await this.priv.createPrivilege(privilegeData);
      res.status(201).json({ data: newPrivilege, message: 'Privilege created successfully' });
    } catch (error) {
      next(error);
    }
  };

  public updatePrivilege = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const privilegeData: Partial<IPrivilege> = req.body;
      const updatedPrivilege: IPrivilege | null = await this.priv.updatePrivilege(id, privilegeData);
      if (!updatedPrivilege) throw new HttpException(404, 'Privilege not found');

      res.status(200).json({ data: updatedPrivilege, message: 'Privilege updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public deletePrivilege = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const deletedPrivilege: IPrivilege | null = await this.priv.deletePrivilege(id);
      if (!deletedPrivilege) throw new HttpException(404, 'Privilege not found');

      res.status(200).json({ data: deletedPrivilege, message: 'Privilege deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
