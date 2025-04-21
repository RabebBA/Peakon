import { Router } from 'express';
import { UserRoleController } from '@/controllers/user.role.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { verifyAdmin } from '@middlewares/admin.middleware';

export class UserRoleRoute implements Routes {
  public path = '/user-roles';
  public router = Router();
  public userRole = new UserRoleController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, /*verifyAdmin,*/ this.userRole.getUserRoles); // Get all user roles
    this.router.get(`${this.path}/:id`, AuthMiddleware, /*verifyAdmin,*/ this.userRole.getUserRoleById); // Get user role by ID
    this.router.post(`${this.path}`, AuthMiddleware, /*verifyAdmin,*/ this.userRole.createUserRole); // Create user role
    this.router.put(`${this.path}/:id`, AuthMiddleware, /*verifyAdmin,*/ this.userRole.updateUserRole); // Update user role by ID
    this.router.delete(`${this.path}/:id`, AuthMiddleware, /*verifyAdmin,*/ this.userRole.deleteUserRole); // Delete user role by ID
  }
}
