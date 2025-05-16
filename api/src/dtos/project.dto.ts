import { z } from 'zod';

export const WorkFlowSchema = z.object({
  status: z.string().min(1, 'Status ID is required'),
  transitions: z
    .array(
      z.object({
        targetStatus: z.string().min(1, 'Target status ID is required'),
        allowedPriv: z.array(z.string().min(1, 'Privlege ID is required')),
      }),
    )
    .optional(),
});

export const CreateProjectDto = z.object({
  name: z.string().min(1, 'Project name is required'),
  desc: z.string().optional(),
  createdBy: z.string().min(1, 'Creator ID is required'),
  workflow: z.array(z.string().min(1)),
  deliveryDate: z.string().datetime('Invalid date format'),
  config: z.string().min(1, 'Configuration ID is required'),
  status: z.string().min(1, 'Status ID is required'),
});

export const UpdateProjectDto = z.object({
  name: z.string().min(1).optional(),
  desc: z.string().optional(),
  workflow: z.array(z.string().min(1)).optional(),
  dateLivraison: z.string().datetime('Invalid date format').optional(),
  config: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
});
