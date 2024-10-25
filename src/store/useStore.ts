import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WorkEntry, FreelanceSettings } from '../types';

interface State {
  entries: WorkEntry[];
  settings: FreelanceSettings;
  addEntry: (entry: WorkEntry) => void;
  updateSettings: (settings: Partial<FreelanceSettings>) => void;
  removeEntry: (id: string) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      entries: [],
      settings: {
        clientEmails: [],
        currency: 'EUR',
        fullName: '',
        address: '',
        siret: '',
      },
      addEntry: (entry) =>
        set((state) => ({ entries: [...state.entries, entry] })),
      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'freelance-storage',
    }
  )
);