'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Caregiver, CaregiverForm, caregiverFormSchema } from '../data/schema';
import { useCaregiverMutations } from '../api/caregivers-api';

export function CaregiversActionDialog({
  currentRow,
  open,
  onOpenChange,
}: {
  currentRow?: Caregiver;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isEdit = !!currentRow;
  const queryClient = useQueryClient();
  const { create, update } = useCaregiverMutations();

  const form = useForm<CaregiverForm>({
    resolver: zodResolver(caregiverFormSchema),
    defaultValues: isEdit && currentRow
      ? {
          name: currentRow.name,
          email: currentRow.email || '',
          phone: currentRow.phone || '',
          isActive: currentRow.isActive,
        }
      : {
          name: '',
          email: '',
          phone: '',
          isActive: true,
        },
  });

  const onSubmit = async (values: CaregiverForm) => {
    try {
      if (isEdit) {
        await update.mutateAsync({ id: currentRow.id, data: values });
      } else {
        await create.mutateAsync(values);
      }
      queryClient.invalidateQueries({ queryKey: ['caregivers'] });
      toast({ title: isEdit ? 'Caregiver updated' : 'Caregiver created' });
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
          <DialogTitle>{isEdit ? 'Edit Caregiver' : 'Add Caregiver'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update caregiver details.' : 'Create a new caregiver.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="caregiver-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium leading-none">
                    Active
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="caregiver-form">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}