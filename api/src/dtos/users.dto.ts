import { z } from 'zod';

export const UserSchema = z.object({
  firstname: z.string().min(1, 'Le prénom est requis'),
  lastname: z.string().min(1, 'Le nom est requis'),
  matricule: z.string().min(1, 'Le matricule est requis'),
  job: z.string().max(500, 'La description du poste ne doit pas dépasser 500 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  role: z.array(z.string()).default(['USER']),
  privilege: z.array(z.string()).default([]),
  photo: z.string().optional(),
  phone: z.string().regex(/^\d{10,15}$/, 'Numéro de téléphone invalide'), // Accepte entre 10 et 15 chiffres
  isConnected: z.boolean().default(false),
  isActive: z.boolean().default(true),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.number().optional(),
});

// DTO pour la création d’un utilisateur (exclut les champs optionnels)
export const CreateUserSchema = UserSchema.omit({ resetPasswordToken: true, resetPasswordExpires: true });

// DTO pour la mise à jour (rendre les champs optionnels)
export const UpdateUserSchema = UserSchema.partial();

export const ResetPasswordDto = z
  .object({
    token: z.string().min(1, { message: 'Le token est requis' }),
    newPassword: z.string().min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
    confirmPassword: z.string().min(8, { message: 'La confirmation du mot de passe est requise' }),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export const ForgetPasswordDto = z.object({
  email: z.string().email({ message: "L'email est invalide" }),
});
