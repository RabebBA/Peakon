import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { IUser } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';

import nodemailer from 'nodemailer';
import { EMAIL_USER, Email_PWD } from '@/config';
import { RoleModel } from '@/models/role.model';
import { PrivilegeModel } from '@/models/privilege.model';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: Email_PWD,
  },
});

@Service()
export class UserService {
  //Retrieves all Users
  public async findAllUser(): Promise<IUser[]> {
    const users: IUser[] = await UserModel.find();
    return users;
  }

  //Retrieves User By Id
  public async findUserById(userId: string): Promise<IUser> {
    const findUser: IUser = await UserModel.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  // Créer un utilisateur et envoyer un email
  /*public async createUser(userData: IUser): Promise<IUser> {
    const findUser: IUser = await UserModel.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const email = userData.email.toLowerCase();
    const hashedPassword = await hash(userData.password, 10);
    const createUserData: IUser = await UserModel.create({ ...userData, password: hashedPassword, email: email });

    // Préparer l'email pour l'utilisateur
    const mailOptions = {
      from: EMAIL_USER,
      to: createUserData.email,
      subject: "Vos données d'authentification",
      text: `Bonjour ${createUserData.firstname},\n\nVotre compte a été créé avec succès sur la plateforme.\nVoici vos informations de connexion :\n\nMot de passe : ${userData.password}\n\nN'oubliez pas de changer votre mot de passe après votre première connexion.\n\nCordialement,\nL'équipe de la plateforme`,
    };

    // Envoyer l'email
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new HttpException(500, 'Error sending email to the user');
    }

    return createUserData;
  }*/

  public async createUser(userData: IUser): Promise<IUser> {
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const email = userData.email.toLowerCase();
    const hashedPassword = await hash(userData.password, 10);

    // Vérification des rôles globaux uniquement
    const roles = await RoleModel.find({ _id: { $in: userData.roleId }, type: 'Global' });
    if (roles.length !== userData.roleId.length) {
      throw new HttpException(400, 'Only global roles are allowed at user creation');
    }

    // Vérification des privilèges globaux uniquement
    const privileges = await PrivilegeModel.find({ _id: { $in: userData.privId }, type: 'Global' });
    if (privileges.length !== userData.privId.length) {
      throw new HttpException(400, 'Only global privileges are allowed at user creation');
    }

    const user = await UserModel.create({
      ...userData,
      password: hashedPassword,
      email,
      privId: privileges.map(p => p._id),
    });

    // Créer un rôle global spécifique au user
    const role = await RoleModel.create({
      title: `${user.firstname.toUpperCase()}_${user.lastname.toUpperCase()}_ROLE`,
      type: 'Global',
      privId: privileges.map(p => p._id),
      userId: [user._id],
    });

    user.roleId.push(role._id);
    await user.save();

    try {
      await transporter.sendMail({
        from: EMAIL_USER,
        to: user.email,
        subject: "Vos données d'authentification",
        text: `Bonjour ${user.firstname},\n\nVotre compte a été créé avec succès.\nMot de passe : ${userData.password}\n\nMerci,`,
      });
    } catch (error) {
      throw new HttpException(500, 'Error sending email to the user');
    }

    return user;
  }

  //Update User
  public async updateUser(userId: string, userData: IUser): Promise<IUser> {
    if (userData.email) {
      const findUser: IUser | null = await UserModel.findOne({ email: userData.email });
      if (findUser && findUser._id.toString() !== userId) {
        throw new HttpException(409, `This email ${userData.email} already exists`);
      }
    }

    let updatedUserData: Partial<IUser> = { ...userData }; // Copie pour modification

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      updatedUserData.password = hashedPassword;
    }

    if (userData.email) {
      const email = userData.email.toLowerCase();
      updatedUserData.email = email;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedUserData, { new: true });

    if (!updatedUser) {
      throw new HttpException(404, 'User not found');
    }

    // Préparer l'email pour l'utilisateur
    const mailOptions = {
      from: EMAIL_USER,
      to: updatedUser.email,
      subject: "Vos données d'authentification",
      text: `Bonjour ${updatedUser.firstname},\n\nVotre compte a été modifié avec succès sur la plateforme.\nVoici vos nouveaux informations de connexion :\n\nMot de passe : ${userData.password}\n\nN'oubliez pas de changer votre mot de passe après votre première connexion.\n\nCordialement,\nL'équipe de la plateforme`,
    };

    // Envoyer l'email
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new HttpException(500, 'Error sending email to the user');
    }

    return updatedUser;
  }

  //Delete User
  public async deleteUser(userId: string): Promise<IUser> {
    const deleteUserById: IUser = await UserModel.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

    return deleteUserById;
  }

  //Consulter son propre profil
  public async findProfilById(requestingUserId: string, userId: string): Promise<IUser> {
    if (requestingUserId !== userId) {
      throw new HttpException(403, 'You are not allowed to access this profile');
    }

    const findUser: IUser = await UserModel.findById(userId);
    if (!findUser) throw new HttpException(404, "User doesn't exist");

    return findUser;
  }

  //Modifier sa photo de profil
  public async updateProfilePhoto(userId: string, photoUrl: string): Promise<IUser> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new HttpException(404, "User doesn't exist");
    }

    user.photo = photoUrl;
    await user.save();

    return user;
  }

  //Désactiver un compte
  public async deactivateUser(userId: string): Promise<IUser> {
    const user = await UserModel.findByIdAndUpdate(userId, { isActive: false }, { new: true });
    if (!user) throw new Error('User not found');
    return user;
  }

  //Réactiver un compte
  public async reactivateUser(userId: string): Promise<IUser> {
    const user = await UserModel.findByIdAndUpdate(userId, { isActive: true }, { new: true });
    if (!user) throw new Error('User not found');
    return user;
  }
}
