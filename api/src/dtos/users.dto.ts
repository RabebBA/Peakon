import { z } from 'zod';

export const UserSchema = z.object({
  firstname: z.string().min(1, 'Le prénom est requis'),
  lastname: z.string().min(1, 'Le nom est requis'),
  matricule: z.string().min(1, 'Le matricule est requis'),
  job: z.string().max(500, 'La description du poste ne doit pas dépasser 500 caractères').optional(),
  email: z.string().email('Email invalide'),
  roleId: z.array(z.string().regex(/^[a-f\d]{24}$/i, 'ID de rôle invalide')),
  photo: z.string().optional(),
  phone: z
    .string()
    .regex(/^\d{8,15}$/, 'Numéro de téléphone invalide')
    .optional(),
  isConnected: z.boolean().default(false),
  isActive: z.boolean().default(false),
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
