import jwt from 'jsonwebtoken';
import { HttpException } from '@exceptions/httpException';
import { SECRET_KEY } from '@config';

export const verifyToken = (req, next) => {
  const token = req.cookie.accessToken;
  if (!token) throw new HttpException(401, 'You are not authenticated!');

  jwt.verify(token, SECRET_KEY);
};
