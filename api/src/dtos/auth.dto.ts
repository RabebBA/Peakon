import { z } from 'zod';

// Schéma de validation pour la connexion
export const LoginDto = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

// Schéma de validation pour la demande de réinitialisation du mot de passe
export const ForgetPasswordDto = z.object({
  email: z.coerce.string().email('Email invalide'),
});

// Schéma de validation pour la réinitialisation du mot de passe
export const ResetPasswordDto = z.object({
  resetToken: z.string().min(20, 'Reset token must be at least 20 characters long'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
});

// Schéma pour le token
export const TokenDataDto = z.object({
  expiresIn: z.number().min(0, 'Expiry time must be a positive number'),
  token: z.string(),
});
