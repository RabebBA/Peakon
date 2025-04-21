import { z } from 'zod';

export const GitLinkSchema = z.string().refine(value => /^(https?:\/\/)?(www\.)?github\.com\/.+\/.+/.test(value), 'Doit être un lien GitHub valide');
