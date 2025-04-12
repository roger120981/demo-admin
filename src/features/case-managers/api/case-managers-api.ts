import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { CaseManager, CaseManagerForm } from '../data/schema';
import { useCaseManagersStore } from '@/features/case-managers/stores/case-managers-store';
import { apiClient } from '@/config/axios';

export const useCaseManagers = () => {
  const { page, pageSize, filters, sort } = useCaseManagersStore();
  return useQuery({
    queryKey: ['case-managers', page, pageSize, filters, sort],
    queryFn: async () => {
      const params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
        filters: JSON.stringify(filters),
        sortBy: sort?.id,
        sortOrder: sort?.desc ? 'desc' : 'asc',
      };
      const { data } = await apiClient.get<{
        data: CaseManager[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
        hasNext: boolean;
      }>('/case-managers', { params });
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCaseManagersList = () => {
  return useQuery({
    queryKey: ['case-managers', 'list'],
    queryFn: async () => {
      const { data } = await apiClient.get<{
        data: { id: number; name: string; email?: string; phone?: string; agencyId: number }[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
        hasNext: boolean;
      }>('/case-managers');
      return data.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCaseManagerMutations = () => {
  const queryClient = useQueryClient();
  return {
    create: useMutation({
      mutationFn: (data: CaseManagerForm) => apiClient.post<CaseManager>('/case-managers', data).then((res) => res.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['case-managers'] }),
    }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<CaseManagerForm> }) =>
        apiClient.put<CaseManager>(`/case-managers/${id}`, data).then((res) => res.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['case-managers'] }),
    }),
    remove: useMutation({
      mutationFn: (id: number) => apiClient.delete(`/case-managers/${id}`),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['case-managers'] }),
    }),
  };
};