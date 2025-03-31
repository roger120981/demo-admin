import React, { useState } from 'react';
import useDialogState from '@/hooks/use-dialog-state';
import { Participant } from '../data/schema';
import { ParticipantsDialogType, ParticipantsContextType, ParticipantsContext } from './participants-context';

interface Props {
  children: React.ReactNode;
}

export default function ParticipantsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ParticipantsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Participant | null>(null);

  // Tipamos el valor del contexto con ParticipantsContextType
  const value: ParticipantsContextType = { open, setOpen, currentRow, setCurrentRow };

  return (
    <ParticipantsContext.Provider value={value}>
      {children}
    </ParticipantsContext.Provider>
  );
}