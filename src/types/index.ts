export type WorkType = 'daily' | 'hourly';

export interface WorkEntry {
  id: string;
  date: Date;
  type: WorkType;
  amount: number; // 1 for full day, 0.5 for half day, or number of hours
  notes?: string;
}

export interface FreelanceSettings {
  dailyRate?: number; // TJM
  hourlyRate?: number;
  clientEmails: string[];
  currency: string;
  fullName: string;
  address: string;
  siret: string;
}