import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` }); //valeur par defaut "developement"

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
export const { DB_HOST, DB_PORT, DB_DATABASE, MONGODB_URI, EMAIL_USER, Email_PWD, GEMINI_API_KEY } = process.env;
