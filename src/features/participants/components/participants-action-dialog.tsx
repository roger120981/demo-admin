'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient, useMutation } from '@tanstack/react-query';
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
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Participant, ParticipantForm, participantFormSchema } from '../data/schema';
import { useCaseManagersList, useCaregiversList, useAgenciesList, useParticipantMutations, useParticipantCaregivers } from '../api/participants-api';
import axios from 'axios';
import { formatDateForInput, CaregiverField } from '@/utils/dateUtils';

const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

export function ParticipantsActionDialog({ currentRow, open, onOpenChange }: { currentRow?: Participant; open: boolean; onOpenChange: (open: boolean) => void }) {
  const isEdit = !!currentRow;
  const queryClient = useQueryClient();

  const { data: caseManagers, isLoading: caseManagersLoading, isError: caseManagersError } = useCaseManagersList();
  const { data: caregivers, isLoading: caregiversLoading } = useCaregiversList();
  const { data: agencies, isLoading: agenciesLoading, isError: agenciesError } = useAgenciesList();
  const { data: currentCaregiverIds, isLoading: caregiverIdsLoading } = useParticipantCaregivers(isEdit ? currentRow?.id : undefined);

  const { create, update, assignCaregiver, unassignCaregiver } = useParticipantMutations();

  const form = useForm<ParticipantForm>({
    resolver: zodResolver(participantFormSchema),
    defaultValues: isEdit && currentRow
      ? {
          ...currentRow,
          dob: formatDateForInput(currentRow.dob),
          locStartDate: formatDateForInput(currentRow.locStartDate),
          locEndDate: formatDateForInput(currentRow.locEndDate),
          pocStartDate: formatDateForInput(currentRow.pocStartDate),
          pocEndDate: formatDateForInput(currentRow.pocEndDate),
          caseManager: { connect: { id: currentRow.cmID } },
          caregiverIds: currentCaregiverIds || [],
        }
      : {
          name: '',
          gender: '',
          medicaidId: '',
          dob: '',
          location: '',
          community: '',
          address: '',
          primaryPhone: '',
          secondaryPhone: '',
          isActive: true,
          locStartDate: '',
          locEndDate: '',
          pocStartDate: '',
          pocEndDate: '',
          units: 0,
          hours: 0,
          hdm: false,
          adhc: false,
          caseManager: { connect: { id: undefined } },
          caregiverIds: [],
        },
  });

  const [caseManagerMode, setCaseManagerMode] = React.useState<'connect' | 'create'>('connect');
  const [openCaregiverSelect, setOpenCaregiverSelect] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState(''); // Estado para el término de búsqueda

  React.useEffect(() => {
    if (isEdit && currentCaregiverIds) {
      form.setValue('caregiverIds', currentCaregiverIds);
    }
  }, [isEdit, currentCaregiverIds, form]);

  const createCaseManagerMutation = useMutation({
    mutationFn: async (data: { name: string; email?: string; phone?: string; agencyId: number }) => {
      const { data: response } = await apiClient.post<{ success: boolean; message: string; data: { id: number; name: string; email?: string; phone?: string; agencyId: number; createdAt: string; updatedAt: string } }>('/case-managers', data);
      return response.data;
    },
    onSuccess: (newCaseManager) => {
      queryClient.setQueryData(['case-managers', 'list'], (old: { id: number; name: string; email?: string; phone?: string; agencyId: number; createdAt: string; updatedAt: string }[] | undefined) => {
        if (!old) return [newCaseManager];
        return [...old, newCaseManager];
      });
      setCaseManagerMode('connect');
      form.setValue('caseManager', { connect: { id: newCaseManager.id } });
      toast({ title: 'Case Manager Created', description: `${newCaseManager.name} has been created and selected.` });
    },
    onError: (error) => {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    },
  });

  const onSubmit = async (values: ParticipantForm) => {
    try {
      let participantId: number;
      const { caregiverIds, ...participantData } = values;

      if (isEdit) {
        await update.mutateAsync({ id: currentRow.id, data: participantData });
        participantId = currentRow.id;
      } else {
        const newParticipant = await create.mutateAsync(participantData);
        participantId = newParticipant.id;
      }

      const newCaregiverIds = values.caregiverIds || [];
      const oldCaregiverIds = currentCaregiverIds || [];

      const toAssign = newCaregiverIds.filter((id) => !oldCaregiverIds.includes(id));
      await Promise.all(toAssign.map((caregiverId) =>
        assignCaregiver.mutateAsync({ participantId, caregiverId })
      ));

      const toUnassign = oldCaregiverIds.filter((id) => !newCaregiverIds.includes(id));
      await Promise.all(toUnassign.map((caregiverId) =>
        unassignCaregiver.mutateAsync({ participantId, caregiverId })
      ));

      queryClient.invalidateQueries({ queryKey: ['participants'] });
      toast({ title: isEdit ? 'Participant updated' : 'Participant created' });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    }
  };

  const handleCreateCaseManager = () => {
    const caseManagerData = form.getValues('caseManager.create');
    if (caseManagerData && caseManagerData.name && caseManagerData.agencyId) {
      createCaseManagerMutation.mutate(caseManagerData);
    } else {
      toast({ title: 'Error', description: 'Name and Agency are required for a new case manager.', variant: 'destructive' });
    }
  };

  const handleRemoveCaregiver = (field: CaregiverField, caregiverId: number) => {
    const currentCaregiverIds = field.value || [];
    field.onChange(currentCaregiverIds.filter((id) => id !== caregiverId));
  };

  if (caseManagersLoading || caregiversLoading || agenciesLoading || (isEdit && caregiverIdsLoading)) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Participant' : 'Add Participant'}</DialogTitle>
            <DialogDescription>Loading data...</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (caseManagersError || agenciesError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Participant' : 'Add Participant'}</DialogTitle>
            <DialogDescription>Error loading data. Please try again.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const caseManagersArray = caseManagers || [];
  const caregiversArray = Array.isArray(caregivers) ? caregivers : [];
  const agenciesArray = Array.isArray(agencies) ? agencies : [];

  // Filtrar caregivers según el término de búsqueda
  const filteredCaregivers = caregiversArray.filter((caregiver) =>
    caregiver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={(state) => { form.reset(); onOpenChange(state); }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Participant' : 'Add Participant'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update participant details.' : 'Create a new participant. Add a case manager and select it instantly.'}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-1">
          <Form {...form}>
            <form id="participant-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                      <SelectItem value="O">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="medicaidId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicaid ID</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="dob" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="community" render={({ field }) => (
                <FormItem>
                  <FormLabel>Community</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="primaryPhone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Phone</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="secondaryPhone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Phone</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel>Active</FormLabel>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="locStartDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Start Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="locEndDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Location End Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="pocStartDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>POC Start Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="pocEndDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>POC End Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="units" render={({ field }) => (
                <FormItem>
                  <FormLabel>Units</FormLabel>
                  <FormControl><Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="hours" render={({ field }) => (
                <FormItem>
                  <FormLabel>Hours</FormLabel>
                  <FormControl><Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="hdm" render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel>HDM</FormLabel>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="adhc" render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel>ADHC</FormLabel>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="caseManager" render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Manager</FormLabel>
                  <RadioGroup
                    value={caseManagerMode}
                    onValueChange={(value) => {
                      setCaseManagerMode(value as 'connect' | 'create');
                      field.onChange(value === 'connect' ? { connect: { id: undefined } } : { create: { name: '', email: '', phone: '', agencyId: undefined } });
                    }}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="connect" id="connect" />
                      <FormLabel htmlFor="connect">Select Existing</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="create" id="create" />
                      <FormLabel htmlFor="create">Create New</FormLabel>
                    </div>
                  </RadioGroup>
                  {caseManagerMode === 'connect' && (
                    <Select
                      onValueChange={(value) => field.onChange({ connect: { id: Number(value) } })}
                      value={field.value?.connect?.id?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a case manager" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {caseManagersArray.length === 0 ? (
                          <SelectItem value="" disabled>No case managers available</SelectItem>
                        ) : (
                          caseManagersArray.map((cm) => (
                            <SelectItem key={cm.id} value={cm.id.toString()}>{cm.name}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                  {caseManagerMode === 'create' && (
                    <div className="space-y-4">
                      <FormField control={form.control} name="caseManager.create.name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="caseManager.create.email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (optional)</FormLabel>
                          <FormControl><Input type="email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="caseManager.create.phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (optional)</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="caseManager.create.agencyId" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agency</FormLabel>
                          <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={agenciesLoading ? 'Loading agencies...' : 'Select an agency'} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {agenciesArray.length === 0 ? (
                                <SelectItem value="" disabled>No agencies available</SelectItem>
                              ) : (
                                agenciesArray.map((agency) => (
                                  <SelectItem key={agency.id} value={agency.id.toString()}>{agency.name}</SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type="button" onClick={handleCreateCaseManager} disabled={createCaseManagerMutation.isPending}>
                        {createCaseManagerMutation.isPending ? 'Saving...' : 'Save Case Manager'}
                      </Button>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="caregiverIds" render={({ field }) => (
                <FormItem>
                  <FormLabel>Caregivers</FormLabel>
                  <Popover open={openCaregiverSelect} onOpenChange={setOpenCaregiverSelect}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {field.value?.length || 0} selected
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search caregivers..."
                          value={searchTerm}
                          onValueChange={setSearchTerm} // Actualiza el término de búsqueda
                        />
                        <CommandEmpty>No caregivers found.</CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-y-auto">
                          {filteredCaregivers.map((caregiver) => (
                            <CommandItem
                              key={caregiver.id}
                              value={caregiver.name}
                              onSelect={() => {
                                const newValue = field.value?.includes(caregiver.id)
                                  ? field.value.filter((id) => id !== caregiver.id)
                                  : [...(field.value || []), caregiver.id];
                                field.onChange(newValue);
                              }}
                            >
                              <Checkbox checked={field.value?.includes(caregiver.id)} className="mr-2" />
                              {caregiver.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {field.value?.length ? (
                    <div className="mt-2">
                      <ul className="space-y-2">
                        {field.value.map((caregiverId) => {
                          const caregiver = caregiversArray.find((c) => c.id === caregiverId);
                          return (
                            <li key={caregiverId} className="flex items-center justify-between">
                              <span>{caregiver?.name || 'Unknown Caregiver'}</span>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveCaregiver(field, caregiverId)}
                              >
                                Remove
                              </Button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )} />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type="submit" form="participant-form" disabled={createCaseManagerMutation.isPending}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}