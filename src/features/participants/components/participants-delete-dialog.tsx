'use client';

import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Participant } from '../data/schema';
import { useParticipantMutations } from '../api/participants-api';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Participant;
}

export function ParticipantsDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('');
  const queryClient = useQueryClient();
  const { remove } = useParticipantMutations();

  const handleDelete = async () => {
    if (value.trim() !== currentRow.medicaidId) return;
    try {
      await remove.mutateAsync(currentRow.id);
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      toast({ title: 'Participant deleted' });
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
      disabled={value.trim() !== currentRow.medicaidId}
      title={
        <span className="text-destructive">
          <IconAlertTriangle className="mr-1 inline-block stroke-destructive" size={18} /> Delete Participant
        </span>
      }
      desc={
        <div className="space-y-4">
          <p>
            Are you sure you want to delete <span className="font-bold">{currentRow.name}</span>?
            <br />
            This action will permanently remove the participant with Medicaid ID{' '}
            <span className="font-bold">{currentRow.medicaidId}</span>.
          </p>
          <Label>
            Medicaid ID:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter Medicaid ID to confirm"
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