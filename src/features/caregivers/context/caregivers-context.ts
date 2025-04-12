import React from 'react';
import { Caregiver } from '../data/schema';

// Definimos y exportamos el tipo para los diálogos
export type CaregiversDialogType = 'add' | 'edit' | 'delete';

// Definimos y exportamos la interfaz para el contexto
export interface CaregiversContextType {
  open: CaregiversDialogType | null;
  setOpen: (str: CaregiversDialogType | null) => void;
  currentRow: Caregiver | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Caregiver | null>>;
}

// Creamos el contexto tipado
export const CaregiversContext = React.createContext<CaregiversContextType | null>(null);

export const useCaregiversContext = () => {
  const context = React.useContext(CaregiversContext);
  if (!context) {
    throw new Error('useCaregiversContext must be used within CaregiversProvider');
  }
  return context;
};