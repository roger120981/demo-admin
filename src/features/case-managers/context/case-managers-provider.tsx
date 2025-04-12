import React, { useState } from 'react';
import useDialogState from '@/hooks/use-dialog-state';
import { CaseManager } from '@/features/case-managers/data/schema';
import { CaseManagersDialogType, CaseManagersContextType, CaseManagersContext } from './case-managers-context';

interface Props {
  children: React.ReactNode;
}

export default function CaseManagersProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<CaseManagersDialogType>(null);
  const [currentRow, setCurrentRow] = useState<CaseManager | null>(null);

  // Tipamos el valor del contexto con CaseManagersContextType
  const value: CaseManagersContextType = { open, setOpen, currentRow, setCurrentRow };

  return (
    <CaseManagersContext.Provider value={value}>
      {children}
    </CaseManagersContext.Provider>
  );
}