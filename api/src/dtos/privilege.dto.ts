import { z } from 'zod';

export const PrivilegeSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, 'Le titre est requis'),
  privType: z.enum(['Platform', 'Project']).or(z.string()),
  description: z.string().optional(),
});

export type IPrivilegeDTO = z.infer<typeof PrivilegeSchema>;
