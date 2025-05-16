import { Router } from 'express';
import { RoleController } from '@/controllers/role.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class RoleRoute implements Routes {
  public path = '/role';
  public router = Router();
  public role = new RoleController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // GET /role/project - Récupérer les rôles de type "Project"
    this.router.get(`${this.path}/project`, AuthMiddleware, this.role.getProjectRoles);

    // GET /role/global - Récupérer les rôles de type "Global"
    this.router.get(`${this.path}/global`, AuthMiddleware, this.role.getGlobalRoles);

    // GET /role - Récupérer les rôles de type "Global"
    this.router.get(`${this.path}`, AuthMiddleware, this.role.getAllRoles);

    // GET /role/project/:projectId - Récupérer les rôles de type "Project" pour un projet spécifique
    this.router.get(`${this.path}/project/:projectId`, AuthMiddleware, this.role.getProjectRolesByProjectId);

    // GET /role/user/:userId/project - Récupérer les rôles de type "Project" spécifiques à un utilisateur
    //this.router.get(`${this.path}/user/:userId/project`, AuthMiddleware, this.role.getProjectRoleByUserId);

    // GET /role/user/:userId/global - Récupérer les rôles de type "Global" spécifiques à un utilisateur
    //this.router.get(`${this.path}/user/:userId/global`, AuthMiddleware, this.role.getGlobalRoleByUserId);

    // GET /role/:id - Récupérer un rôle par ID
    this.router.get(`${this.path}/:id`, AuthMiddleware, this.role.getRoleById);

    // POST /role - Créer un rôle
    this.router.post(`${this.path}`, AuthMiddleware, this.role.createRole);

    // PUT /role/:id - Mettre à jour un rôle
    this.router.put(`${this.path}/:id`, AuthMiddleware, this.role.updateRole);

    // PATCH /role/:id/enable - Activer un rôle
    this.router.patch(`${this.path}/:id/enable`, AuthMiddleware, this.role.enableRole);

    // PATCH /role/:id/disable - Désactiver un rôle
    this.router.patch(`${this.path}/:id/disable`, AuthMiddleware, this.role.disableRole);
  }
}
