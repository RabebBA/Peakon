import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { IUser } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import upload from '@/config/uploads';
import mongoose from 'mongoose';
import { HttpException } from '@/exceptions/httpException';

export class UserController {
  public user = Container.get(UserService);

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: IUser[] = await this.user.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: IUser = await this.user.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public CreateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: IUser = req.body;
      const createUserData: IUser = await this.user.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: IUser = req.body;
      const updateUserData: IUser = await this.user.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: IUser = await this.user.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public getUserProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      console.log('request sent');
      const userId = req.user._id.toString(); // ID de l'utilisateur extrait du token
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new HttpException(400, 'Invalid ID format');
      }
      const user = await this.user.findProfilById(userId, req.params.id);

      res.status(200).json({ data: user, message: 'User profile retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public updateProfilePhoto = [
    upload.single('photo'), // Utiliser Multer pour gérer le fichier (champ 'photo')
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
      try {
        const userId = req.user._id.toString(); // ID de l'utilisateur connecté
        const photoUrl = req.file?.filename; // Chemin du fichier téléchargé

        if (!photoUrl) {
          return res.status(400).json({ message: 'Photo file is required' });
        }

        const updatedUser = await this.user.updateProfilePhoto(userId, photoUrl);
        res.status(200).json({ data: updatedUser, message: 'Profile photo updated successfully' });
      } catch (error) {
        next(error);
      }
    },
  ];

  public deactivateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deactivatedUser = await this.user.deactivateUser(userId);
      res.status(200).json({ data: deactivatedUser, message: 'Account deactivated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public reactivateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const reactivatedUser = await this.user.reactivateUser(userId);
      res.status(200).json({ data: reactivatedUser, message: 'Account reactivated successfully' });
    } catch (error) {
      next(error);
    }
  };
}
