import React from 'react';
import { Agency } from '../data/schema';

// Definimos y exportamos el tipo para los diálogos
export type AgenciesDialogType = 'add' | 'edit' | 'delete';

// Definimos y exportamos la interfaz para el contexto
export interface AgenciesContextType {
  open: AgenciesDialogType | null;
  setOpen: (str: AgenciesDialogType | null) => void;
  currentRow: Agency | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Agency | null>>;
}

// Creamos el contexto tipado
export const AgenciesContext = React.createContext<AgenciesContextType | null>(null);

export const useAgenciesContext = () => {
  const context = React.useContext(AgenciesContext);
  if (!context) {
    throw new Error('useAgenciesContext must be used within AgenciesProvider');
  }
  return context;
};