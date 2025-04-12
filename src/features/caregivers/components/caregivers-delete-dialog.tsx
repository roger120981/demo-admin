'use client';

import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Caregiver } from '../data/schema';
import { useCaregiverMutations } from '../api/caregivers-api';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Caregiver;
}

export function CaregiversDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('');
  const queryClient = useQueryClient();
  const { remove } = useCaregiverMutations();

  const handleDelete = async () => {
    if (value.trim() !== currentRow.name) return;
    try {
      await remove.mutateAsync(currentRow.id);
      queryClient.invalidateQueries({ queryKey: ['caregivers'] });
      toast({ title: 'Caregiver deleted' });
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
          <IconAlertTriangle className="mr-1 inline-block stroke-destructive" size={18} /> Delete Caregiver
        </span>
      }
      desc={
        <div className="space-y-4">
          <p>
            Are you sure you want to delete <span className="font-bold">{currentRow.name}</span>?
            <br />
            This action will permanently remove the caregiver.
          </p>
          <Label>
            Caregiver Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter caregiver name to confirm"
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