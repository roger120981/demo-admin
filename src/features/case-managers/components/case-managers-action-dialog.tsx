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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CaseManager, CaseManagerForm, caseManagerFormSchema } from '../data/schema';
import { useCaseManagerMutations } from '../api/case-managers-api';
import { useAgencies } from '@/features/agencies/api/agencies-api';
import { Agency } from '@/features/agencies/data/schema';

export function CaseManagersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: {
  currentRow?: CaseManager;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isEdit = !!currentRow;
  const queryClient = useQueryClient();
  const { create, update } = useCaseManagerMutations();
  const { data: agenciesData, isLoading: agenciesLoading } = useAgencies();

  const form = useForm<CaseManagerForm>({
    resolver: zodResolver(caseManagerFormSchema),
    defaultValues: isEdit && currentRow
      ? {
          name: currentRow.name,
          email: currentRow.email || '',
          phone: currentRow.phone || '',
          agencyId: currentRow.agencyId,
        }
      : {
          name: '',
          email: '',
          phone: '',
          agencyId: 0,
        },
  });

  const onSubmit = async (values: CaseManagerForm) => {
    try {
      if (isEdit) {
        await update.mutateAsync({ id: currentRow.id, data: values });
      } else {
        await create.mutateAsync(values);
      }
      queryClient.invalidateQueries({ queryKey: ['case-managers'] });
      toast({ title: isEdit ? 'Case Manager updated' : 'Case Manager created' });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    }
  };

  if (agenciesLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Case Manager' : 'Add Case Manager'}</DialogTitle>
            <DialogDescription>Loading agencies...</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const agencies = agenciesData?.data || [];

  return (
    <Dialog open={open} onOpenChange={(state) => { form.reset(); onOpenChange(state); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Case Manager' : 'Add Case Manager'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update case manager details.' : 'Create a new case manager.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="case-manager-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="agencyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agency</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an agency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {agencies.length === 0 ? (
                        <SelectItem value="" disabled>No agencies available</SelectItem>
                      ) : (
                        agencies.map((agency: Agency) => (
                          <SelectItem key={agency.id} value={agency.id.toString()}>
                            {agency.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="case-manager-form">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}