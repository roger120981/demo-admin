'use client';

import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { CaseManager } from '../data/schema';
import { useCaseManagerMutations } from '../api/case-managers-api';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: CaseManager;
}

export function CaseManagersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('');
  const queryClient = useQueryClient();
  const { remove } = useCaseManagerMutations();

  const handleDelete = async () => {
    if (value.trim() !== currentRow.name) return;
    try {
      await remove.mutateAsync(currentRow.id);
      queryClient.invalidateQueries({ queryKey: ['case-managers'] });
      toast({ title: 'Case Manager deleted' });
      onOpenChange(false);
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name}
      title={
        <span className="text-destructive">
          <IconAlertTriangle className="mr-1 inline-block stroke-destructive" size={18} /> Delete Case Manager
        </span>
      }
      desc={
        <div className="space-y-4">
          <p>
            Are you sure you want to delete <span className="font-bold">{currentRow.name}</span>?
            <br />
            This action will permanently remove the case manager.
          </p>
          <Label>
            Case Manager Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter case manager name to confirm"
            />
          </Label>
          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>This operation cannot be undone.</AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
}