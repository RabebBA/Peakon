import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { EMAIL_USER, Email_PWD, SECRET_KEY } from '@config';
import { HttpException } from '@/exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { IUser } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import { error } from 'console';

const createToken = (user: IUser): TokenData => {
  const dataStoredInToken: DataStoredInToken = { _id: user._id };
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign({ dataStoredInToken, roles: user.roleId }, SECRET_KEY, { expiresIn }) };
};

const createCookie = (createToken: TokenData): string => {
  return `Authorization=${createToken.token}; HttpOnly; Max-Age=${createToken.expiresIn};`;
};

const sendResetPasswordEmail = async (email: string, resetToken: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: Email_PWD,
    },
  });
  console.log(Email_PWD);
  const message = {
    from: EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Please click the link below to reset your password:
    http://localhost:3001/reset-password/${resetToken}`,
  };

  try {
    await transporter.sendMail(message, error);
  } catch (error) {
    throw new HttpException(500, 'Failed to send reset email');
  }
};

@Service()
export class AuthService {
  //LOGIN
  public async login(userData: IUser): Promise<{ cookie: string; findUser: IUser }> {
    const findUser: IUser = await UserModel.findOne({ email: userData.email }).select('+password');
    if (!findUser) {
      throw new HttpException(409, `This email ${userData.email} was not found`);
    }

    if (!userData.password) {
      throw new HttpException(400, 'Password is required');
    }

    if (!findUser.password) {
      throw new HttpException(500, 'User password is missing in the database');
    }

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) {
      throw new HttpException(409, 'Password is not matching');
    }

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);
    await UserModel.findByIdAndUpdate(findUser._id, { isConnected: true }, { new: true });

    return { cookie, findUser };
  }

  //LOGOUT
  public async logout(userData: IUser): Promise<IUser> {
    const findUser: IUser = await UserModel.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);
    await UserModel.findByIdAndUpdate(findUser._id, { isConnected: false }, { new: true });

    return findUser;
  }

  //FORGET PASSWORD
  public async forgetPassword(email: string): Promise<void> {
    console.log(email);
    console.log('Type of email:', typeof email);

    // Vérifie que l'email est bien une chaîne de caractères avant de l'utiliser
    if (typeof email !== 'string' || !email.trim()) {
      throw new HttpException(400, 'Invalid email format');
    }
    const user: IUser = await UserModel.findOne({ email: email });
    if (!user) {
      throw new HttpException(404, `No user found with the email ${email}`);
    }

    // Generate a token for password reset
    const resetToken = randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Expire in 1 hour
    await user.save();

    // Send an email to the user with the reset link
    await sendResetPasswordEmail(email, resetToken);
  }

  //SEND RESET PASSWORD IN EMAIL

  // RESETTING PASSWORD
  public async resetPassword(resetToken: string, newPassword: string): Promise<IUser> {
    const user: IUser = await UserModel.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }, //%gt : greater than
    });

    if (!user) {
      throw new HttpException(400, 'Invalid or expired reset token');
    }

    const hashedPassword = await hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return user;
  }
}
