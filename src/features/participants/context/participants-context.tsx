import React from 'react';
import { Participant } from '../data/schema';

// Definimos y exportamos el tipo para los diálogos
export type ParticipantsDialogType = 'add' | 'edit' | 'delete';

// Definimos y exportamos la interfaz para el contexto
export interface ParticipantsContextType {
  open: ParticipantsDialogType | null;
  setOpen: (str: ParticipantsDialogType | null) => void;
  currentRow: Participant | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Participant | null>>;
}

// Creamos el contexto tipado
export const ParticipantsContext = React.createContext<ParticipantsContextType | null>(null);

export const useParticipantsContext = () => {
  const context = React.useContext(ParticipantsContext);
  if (!context) {
    throw new Error('useParticipantsContext must be used within ParticipantsProvider');
  }
  return context;
};