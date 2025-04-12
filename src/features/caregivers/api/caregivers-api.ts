import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Caregiver, CaregiverForm } from '../data/schema';
import { useCaregiversStore } from '@/features/caregivers/stores/caregivers-store';
import { apiClient } from '@/config/axios';

export const useCaregivers = () => {
  const { page, pageSize, filters, sort } = useCaregiversStore();
  return useQuery({
    queryKey: ['caregivers', page, pageSize, filters, sort],
    queryFn: async () => {
      const params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
        filters: JSON.stringify(filters),
        sortBy: sort?.id,
        sortOrder: sort?.desc ? 'desc' : 'asc',
      };
      const { data } = await apiClient.get<{
        data: Caregiver[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
        hasNext: boolean;
      }>('/caregivers', { params });
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCaregiversList = () => {
  return useQuery({
    queryKey: ['caregivers', 'list'],
    queryFn: async () => {
      const { data } = await apiClient.get<{
        data: { id: number; name: string; email?: string; phone?: string; agencyId: number }[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
        hasNext: boolean;
      }>('/caregivers');
      return data.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCaregiverMutations = () => {
  const queryClient = useQueryClient();
  return {
    create: useMutation({
      mutationFn: (data: CaregiverForm) => apiClient.post<Caregiver>('/caregivers', data).then((res) => res.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['caregivers'] }),
    }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<CaregiverForm> }) =>
        apiClient.put<Caregiver>(`/caregivers/${id}`, data).then((res) => res.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['caregivers'] }),
    }),
    remove: useMutation({
      mutationFn: (id: number) => apiClient.delete(`/caregivers/${id}`),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['caregivers'] }),
    }),
  };
};