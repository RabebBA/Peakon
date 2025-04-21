export type StatusType = 'En attente' | 'En dev' | 'A tester' | 'En attente de build' | 'KO' | string;

export interface IStatus {
  _id?: string;
  status: StatusType;
  isScalable: boolean; //évolutive ou figé
}
