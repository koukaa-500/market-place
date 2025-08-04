
export interface Societe {
    societeId: number;
    societeName: string;
    email: string;
    address?: string;
    phone?: string;
    employees?: any[]; // Specify a proper type if available
  }