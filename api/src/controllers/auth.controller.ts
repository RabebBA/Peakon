import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { IUser } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';

export class AuthController {
  public auth = Container.get(AuthService);

  //LOGIN
  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: IUser = req.body;
      const { cookie, findUser } = await this.auth.login(userData);

      res.setHeader('Authorization', [cookie]);
      res.json({ data: findUser, cookie, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  //LOGOUT
  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: IUser = req.body;
      await this.auth.logout(userData);
      res.setHeader('Set-Cookie', ['Authorization=; HttpOnly; Path=/; Max-Age=0']);
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      next(error);
    }
  };

  //FORGET PASSWORD
  public forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = String(req.body.email);
      await this.auth.forgetPassword(email);
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      next(error);
    }
  };

  // Contrôleur pour la réinitialisation du mot de passe
  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { resetToken, newPassword } = req.body; //resetToken=req.params
      const user = await this.auth.resetPassword(resetToken, newPassword);
      res.status(200).json({ message: 'Password successfully reset', user });
    } catch (error) {
      next(error);
    }
  };
}
