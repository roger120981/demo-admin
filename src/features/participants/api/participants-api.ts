import axios from 'axios';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Participant, ParticipantForm } from '../data/schema';
import { useParticipantsStore } from '../stores/participants-store';

const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Tipo para la respuesta paginada de case managers
type CaseManager = { id: number; name: string; email?: string; phone?: string; agencyId: number; createdAt: string; updatedAt: string };
type CaseManagersResponse = {
  data: CaseManager[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
};

export const useParticipants = () => {
  const { page, pageSize, filters, sort } = useParticipantsStore();
  return useQuery({
    queryKey: ['participants', page, pageSize, filters, sort],
    queryFn: async () => {
      const params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
        filters: JSON.stringify(filters),
        sortBy: sort?.id,
        sortOrder: sort?.desc ? 'desc' : 'asc',
      };
      const { data } = await apiClient.get<{ data: Participant[]; total: number; page: number; pageSize: number; totalPages: number; hasNext: boolean; filterCounts: { isActive: { true: number; false: number }; gender: { M: number; F: number; O: number } } }>('/participants', { params });
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCaseManagersList = () => {
  return useQuery({
    queryKey: ['case-managers', 'list'],
    queryFn: async () => {
      const { data } = await apiClient.get<CaseManagersResponse>('/case-managers');
      return data.data; // Devolver solo el array de case managers
    },
    placeholderData: keepPreviousData,
  });
};

export const useCaregiversList = () => {
  return useQuery({
    queryKey: ['caregivers', 'list'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ id: number; name: string; email?: string; phone?: string; isActive: boolean }[]>('/caregivers');
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useAgenciesList = () => {
  return useQuery({
    queryKey: ['agencies', 'list'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: { id: number; name: string }[]; total: number; page: number; pageSize: number; totalPages: number; hasNext: boolean }>('/agencies');
      return data.data; // Extraemos el array de agencias
    },
    placeholderData: keepPreviousData,
  });
};

export const useParticipantCaregivers = (participantId: number | undefined) => {
  return useQuery({
    queryKey: ['participants', participantId, 'caregivers'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ caregiverId: number; caregiver: { id: number; name: string } }[]>(`/participants/${participantId}/caregivers`);
      return data.map((item) => item.caregiverId);
    },
    enabled: !!participantId,
    placeholderData: keepPreviousData,
  });
};

export const useParticipantMutations = () => {
  const queryClient = useQueryClient();
  return {
    create: useMutation({
      mutationFn: (data: ParticipantForm) => apiClient.post<Participant>('/participants', data).then((res) => res.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['participants'] }),
    }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<ParticipantForm> }) =>
        apiClient.put<Participant>(`/participants/${id}`, data).then((res) => res.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['participants'] }),
    }),
    remove: useMutation({
      mutationFn: (id: number) => apiClient.delete(`/participants/${id}`),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['participants'] }),
    }),
    assignCaregiver: useMutation({
      mutationFn: ({ participantId, caregiverId }: { participantId: number; caregiverId: number }) =>
        apiClient.post(`/participants/${participantId}/caregivers/${caregiverId}`).then((res) => res.data),
      onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ['participants', variables.participantId, 'caregivers'] }),
    }),
    unassignCaregiver: useMutation({
      mutationFn: ({ participantId, caregiverId }: { participantId: number; caregiverId: number }) =>
        apiClient.delete(`/participants/${participantId}/caregivers/${caregiverId}`),
      onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ['participants', variables.participantId, 'caregivers'] }),
    }),
  };
};