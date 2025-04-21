import { set } from 'mongoose';
import mongoose from 'mongoose';
import { NODE_ENV, DB_HOST, DB_PORT, DB_DATABASE, MONGODB_URI } from '@config';

export const dbConnection = async () => {
  if (NODE_ENV !== 'production') {
    set('debug', true);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('DB connected!');
  } catch (error) {
    console.log('Connection failed!');
  }
};
