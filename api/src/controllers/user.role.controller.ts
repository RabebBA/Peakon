import { Request, Response, NextFunction } from 'express';
import { UserRoleService } from '@/services/user.role.service';
import { IUserRole } from '@/interfaces/user.role.interface';
import { Container } from 'typedi';

export class UserRoleController {
  public userRole = Container.get(UserRoleService);

  public getUserRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userRoles: IUserRole[] = await this.userRole.findAllUserRoles();
      res.status(200).json({ data: userRoles, message: 'User roles retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getUserRoleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userRoleId = req.params.id;
      const userRole: IUserRole = await this.userRole.findUserRoleById(userRoleId);
      res.status(200).json({ data: userRole, message: 'User role retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public createUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userRoleData: IUserRole = req.body;
      const newUserRole: IUserRole = await this.userRole.createUserRole(userRoleData);
      res.status(201).json({ data: newUserRole, message: 'User role created successfully' });
    } catch (error) {
      next(error);
    }
  };

  public updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userRoleId = req.params.id;
      const userRoleData: Partial<IUserRole> = req.body;
      const updatedUserRole: IUserRole = await this.userRole.updateUserRole(userRoleId, userRoleData);
      res.status(200).json({ data: updatedUserRole, message: 'User role updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userRoleId = req.params.id;
      const deletedUserRole: IUserRole = await this.userRole.deleteUserRole(userRoleId);
      res.status(200).json({ data: deletedUserRole, message: 'User role deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
