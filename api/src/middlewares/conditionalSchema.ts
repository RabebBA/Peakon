import { z, ZodObject } from 'zod';
import { GitLinkSchema } from '@dtos/git.dto';
import { TaskBaseSchema } from '@dtos/task.dto';

interface ValidationConditions {
  requiredFields?: string[]; // Liste des champs requis
  customSchema?: string; // Schéma personnalisé au format JSON
}

export class ConditionalSchemaFactory {
  static create(status: string, conditions?: ValidationConditions) {
    let schema: ZodObject<any> = TaskBaseSchema as ZodObject<any>; // Cast initial pour éviter les conflits stricts

    // Étendre le schéma de base en fonction du statut
    switch (status) {
      case 'EN_ATTENTE_DE_BUILD':
        schema = schema.extend({
          gitLink: GitLinkSchema,
          dependencies: z.array(z.string().uuid()).optional(),
        });
        break;

      case 'A_TESTER':
        schema = schema.extend({
          testInstructions: z.string().min(10),
          attachments: z.array(z.string().url()).min(1),
        });
        break;

      case 'BLOQUEE':
        schema = schema.extend({
          blockerReason: z.string().min(10).max(200),
          relatedIssues: z.array(z.string().uuid()).min(1),
        });
        break;

      default:
        // Si le statut n'est pas trouvé, on ne fait rien
        break;
    }

    // Ajouter des champs requis à partir des conditions
    if (conditions?.requiredFields) {
      // Fusionner les champs requis tout en gardant les propriétés de base
      schema = schema.extend({
        ...conditions.requiredFields.reduce((acc, field) => {
          acc[field] = z.any().refine(val => !!val, {
            message: `Le champ ${field} est requis`,
          });
          return acc;
        }, {}),
      });
    }

    // Fusionner un schéma personnalisé si fourni
    if (conditions?.customSchema) {
      schema = schema.merge(this.parseCustomSchema(conditions.customSchema));
    }

    return schema;
  }

  private static parseCustomSchema(schemaString: string) {
    try {
      const schemaObj = JSON.parse(schemaString);
      return z.object(schemaObj);
    } catch (error) {
      throw new Error('Le format du schéma personnalisé est invalide');
    }
  }
}
