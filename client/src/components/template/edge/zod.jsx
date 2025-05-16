import { z } from "zod";

export const transitionSchema = z.object({
  transitions: z.array(
    z.object({
      targetStatus: z.string().min(1, "Status requis"),
      allowedRoles: z.array(z.string()).optional(),
      notifUsers: z.array(z.string()).optional(),
      notifRoles: z.array(z.string()).optional(),
      conditions: z
        .object({
          requiredFields: z.array(z.string()).optional(),
          validationSchema: z.string().optional(),
        })
        .optional(),
    })
  ),
});
