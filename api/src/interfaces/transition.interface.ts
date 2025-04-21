export interface Transition {
  targetStatus: string;
  allowedRoles: string[];
  conditions?: {
    requiredFields?: string[];
    validationSchema?: any;
  };
}
