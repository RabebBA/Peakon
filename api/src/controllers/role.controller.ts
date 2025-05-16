import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { RoleService } from '@/services/role.service';
import { IRole } from '@/interfaces/role.interface';

export class RoleController {
  public role = Container.get(RoleService);

  // GET /roles/project - Récupérer les rôles de type "Project"
  public getProjectRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles: IRole[] = await this.role.findProjectRoles();
      res.status(200).json({ data: roles, message: 'Project roles retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  // GET /roles/global - Récupérer les rôles de type "Global"
  public getGlobalRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles: IRole[] = await this.role.findGlobalRole();
      res.status(200).json({ data: roles, message: 'Global roles retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles: IRole[] = await this.role.findAllRoles();
      res.status(200).json({ data: roles, message: 'All roles retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  // GET /roles/project/:projectId - Récupérer les rôles de type "Project" pour un projet spécifique
  public getProjectRolesByProjectId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const roles: IRole[] = await this.role.findProjectRolesByProjectId(projectId);
      res.status(200).json({ data: roles, message: 'Project roles for the specific project retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  // GET /roles/user/:userId - Récupérer les rôles de type "Project" spécifiques à un utilisateur
  /* public getProjectRoleByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const roles: IRole[] = await this.role.findProjectRoleByUserId(userId);
      res.status(200).json({ data: roles, message: 'Project roles for the specific user retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  // GET /roles/global/user/:userId - Récupérer les rôles de type "Global" spécifiques à un utilisateur
  public getGlobalRoleByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const roles: IRole[] = await this.role.findGlobalRoleByUserId(userId);
      res.status(200).json({ data: roles, message: 'Global roles for the specific user retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };*/

  // GET /roles/:id - Récupérer un rôle par ID
  public getRoleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId: string = req.params.id;
      const role: IRole = await this.role.findRoleById(roleId);
      res.status(200).json({ data: role, message: 'Role retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  // POST /roles - Créer un rôle
  public createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleData: IRole = req.body;
      const newRole: IRole = await this.role.createRole(roleData);
      res.status(201).json({ data: newRole, message: 'Role created successfully' });
    } catch (error) {
      next(error);
    }
  };

  // PUT /roles/:id - Mettre à jour un rôle
  public updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId: string = req.params.id;
      const roleData: IRole = req.body;
      const updatedRole: IRole = await this.role.updateRole(roleId, roleData);
      res.status(200).json({ data: updatedRole, message: 'Role updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public enableRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId: string = req.params.id;
      const updatedRole = await this.role.enableRole(roleId);
      res.status(200).json({ data: updatedRole, message: 'Role enabled successfully' });
    } catch (error) {
      next(error);
    }
  };

  public disableRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId: string = req.params.id;
      const updatedRole = await this.role.disableRole(roleId);
      res.status(200).json({ data: updatedRole, message: 'Role disabled successfully' });
    } catch (error) {
      next(error);
    }
  };
}
