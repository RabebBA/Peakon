import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserSchema, UpdateUserSchema } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { verifyAdmin } from '@/middlewares/admin.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // User Management Routes (admin-only access)
    this.router.get(`${this.path}`, AuthMiddleware, /*verifyAdmin,*/ this.user.getUsers); // Get all users
    this.router.get(`${this.path}/:id`, AuthMiddleware, /*verifyAdmin,*/ this.user.getUserById); // Get user by ID
    this.router.post(`${this.path}`, AuthMiddleware, /*verifyAdmin,*/ ValidationMiddleware(CreateUserSchema), this.user.CreateUser); // Create user
    this.router.put(`${this.path}/:id`, AuthMiddleware, /*verifyAdmin,*/ ValidationMiddleware(UpdateUserSchema), this.user.updateUser); // Update user by ID
    //this.router.delete(`${this.path}/:id`, AuthMiddleware, /*verifyAdmin,*/ this.user.deleteUser); // Delete user by ID

    // Account Deactivation Routes (admin-only access)
    this.router.put(`${this.path}/:id/deactivate`, AuthMiddleware, /*verifyAdmin,*/ this.user.deactivateAccount); // Deactivate user account
    this.router.put(`${this.path}/:id/reactivate`, AuthMiddleware, /*verifyAdmin,*/ this.user.reactivateAccount); // Reactivate user account

    // Profile Routes (user-specific access)
    this.router.get(`${this.path}/:id/profil`, AuthMiddleware, this.user.getUserProfile); // Get user profil
    this.router.put(`${this.path}/profile/photo`, AuthMiddleware, this.user.updateProfilePhoto); // Update profile photo
  }
}
