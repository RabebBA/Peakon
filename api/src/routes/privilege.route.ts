import { Router } from 'express';
import { PrivilegeController } from '@/controllers/privilege.controller';
import { Routes } from '@interfaces/routes.interface';
//import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { verifyAdmin } from '@/middlewares/admin.middleware';
import { AuthMiddleware } from '@middlewares/auth.middleware';
//import { IPrivilegeDTO } from '@/dtos/privilege.dto';

export class PrivilegeRoute implements Routes {
  public path = '/privileges';
  public router = Router();
  public priv = new PrivilegeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/project`, AuthMiddleware, /* verifyAdmin,*/ this.priv.getAllProjectPrivilege); // GET all project privileges
    this.router.get(`${this.path}/global`, AuthMiddleware, /* verifyAdmin,*/ this.priv.getAllGlobalPrivilege); // GET all global privileges

    this.router.get(`${this.path}/:id`, AuthMiddleware /*, verifyAdmin*/, this.priv.getPrivilegeById); // GET privilege by ID
    this.router.post(`${this.path}`, AuthMiddleware /*, verifyAdmin /*, ValidationMiddleware(IPrivilegeDTO)*/, this.priv.createPrivilege); // CREATE privilege
    this.router.put(`${this.path}/:id`, AuthMiddleware /*, verifyAdmin /*, ValidationMiddleware(IPrivilegeDTO)*/, this.priv.updatePrivilege); // UPDATE privilege
    this.router.delete(`${this.path}/:id`, AuthMiddleware, /*verifyAdmin,*/ this.priv.deletePrivilege); // DELETE privilege
  }
}
