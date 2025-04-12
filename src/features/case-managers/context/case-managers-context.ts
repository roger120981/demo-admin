import React from 'react';
import { CaseManager } from '@/features/case-managers/data/schema';

// Definimos y exportamos el tipo para los diálogos
export type CaseManagersDialogType = 'add' | 'edit' | 'delete';

// Definimos y exportamos la interfaz para el contexto
export interface CaseManagersContextType {
  open: CaseManagersDialogType | null;
  setOpen: (str: CaseManagersDialogType | null) => void;
  currentRow: CaseManager | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<CaseManager | null>>;
}

// Creamos el contexto tipado
export const CaseManagersContext = React.createContext<CaseManagersContextType | null>(null);

export const useCaseManagersContext = () => {
  const context = React.useContext(CaseManagersContext);
  if (!context) {
    throw new Error('useCaseManagersContext must be used within CaseManagersProvider');
  }
  return context;
};