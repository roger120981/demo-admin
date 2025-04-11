'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Agency, AgencyForm, agencyFormSchema } from '../data/schema';
import { useAgencyMutations } from '../api/agencies-api';

export function AgenciesActionDialog({ currentRow, open, onOpenChange }: { currentRow?: Agency; open: boolean; onOpenChange: (open: boolean) => void }) {
  const isEdit = !!currentRow;
  const queryClient = useQueryClient();
  const { create, update } = useAgencyMutations();

  const form = useForm<AgencyForm>({
    resolver: zodResolver(agencyFormSchema),
    defaultValues: isEdit && currentRow
      ? { name: currentRow.name }
      : { name: '' },
  });

  const onSubmit = async (values: AgencyForm) => {
    try {
      if (isEdit) {
        await update.mutateAsync({ id: currentRow.id, data: values });
      } else {
        await create.mutateAsync(values);
      }
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      toast({ title: isEdit ? 'Agency updated' : 'Agency created' });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(state) => { form.reset(); onOpenChange(state); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Agency' : 'Add Agency'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update agency details.' : 'Create a new agency.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="agency-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="agency-form">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}