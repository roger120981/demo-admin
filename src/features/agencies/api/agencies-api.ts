import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Agency, AgencyForm } from '../data/schema';
import { useAgenciesStore } from '../stores/agencies-store';
import { apiClient } from '@/config/axios';

export const useAgencies = () => {
  const { page, pageSize, filters, sort } = useAgenciesStore();
  return useQuery({
    queryKey: ['agencies', page, pageSize, filters, sort],
    queryFn: async () => {
      const params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
        filters: JSON.stringify(filters),
        sortBy: sort?.id,
        sortOrder: sort?.desc ? 'desc' : 'asc',
      };
      const { data } = await apiClient.get<{ data: Agency[]; total: number; page: number; pageSize: number; totalPages: number; hasNext: boolean }>('/agencies', { params });
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useAgencyMutations = () => {
  const queryClient = useQueryClient();
  return {
    create: useMutation({
      mutationFn: (data: AgencyForm) => apiClient.post<Agency>('/agencies', data).then((res) => res.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agencies'] }),
    }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<AgencyForm> }) =>
        apiClient.put<Agency>(`/agencies/${id}`, data).then((res) => res.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agencies'] }),
    }),
    remove: useMutation({
      mutationFn: (id: number) => apiClient.delete(`/agencies/${id}`),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agencies'] }),
    }),
  };
};