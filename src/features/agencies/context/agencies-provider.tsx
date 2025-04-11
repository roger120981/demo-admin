import React, { useState } from 'react';
import useDialogState from '@/hooks/use-dialog-state';
import { Agency } from '../data/schema';
import { AgenciesDialogType, AgenciesContextType, AgenciesContext } from './agencies-context';

interface Props {
  children: React.ReactNode;
}

export default function AgenciesProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<AgenciesDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Agency | null>(null);

  // Tipamos el valor del contexto con AgenciesContextType
  const value: AgenciesContextType = { open, setOpen, currentRow, setCurrentRow };

  return (
    <AgenciesContext.Provider value={value}>
      {children}
    </AgenciesContext.Provider>
  );
}