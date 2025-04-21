import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { LoginDto, ForgetPasswordDto, ResetPasswordDto } from '@dtos/auth.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { UserModel } from '@/models/users.model';

export class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}login`,
      ValidationMiddleware(LoginDto),
      async (req, res, next) => {
        try {
          const { email } = req.body;
          const user = await UserModel.findOne({ email });

          if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Invalid or deactivated account' });
          }

          next(); // Passe au middleware suivant (logIn)
        } catch (error) {
          next(error);
        }
      },
      this.auth.logIn,
    );

    this.router.post(`${this.path}logout`, AuthMiddleware, this.auth.logOut);
    this.router.post(`${this.path}forget-password`, ValidationMiddleware(ForgetPasswordDto), this.auth.forgetPassword);
    this.router.post(`${this.path}reset-password`, ValidationMiddleware(ResetPasswordDto), this.auth.resetPassword);
  }
}
