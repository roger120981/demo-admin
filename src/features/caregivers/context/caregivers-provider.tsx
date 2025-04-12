import React, { useState } from 'react';
import useDialogState from '@/hooks/use-dialog-state';
import { Caregiver } from '../data/schema';
import { CaregiversDialogType, CaregiversContextType, CaregiversContext } from './caregivers-context';

interface Props {
  children: React.ReactNode;
}

export default function CaregiversProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<CaregiversDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Caregiver | null>(null);

  // Tipamos el valor del contexto con CaregiversContextType
  const value: CaregiversContextType = { open, setOpen, currentRow, setCurrentRow };

  return (
    <CaregiversContext.Provider value={value}>
      {children}
    </CaregiversContext.Provider>
  );
}