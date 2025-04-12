import { create } from 'zustand';

type CaregiversState = {
  page: number;
  pageSize: number;
  filters: Record<string, (string | boolean)[] | undefined>;
  sort: { id: string; desc: boolean } | null;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setFilters: (filters: Partial<CaregiversState['filters']>) => void;
  setSort: (sort: { id: string; desc: boolean } | null) => void;
  reset: () => void;
};

export const useCaregiversStore = create<CaregiversState>((set) => ({
  page: 1,
  pageSize: 10,
  filters: {},
  sort: null,
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setSort: (sort) => set({ sort }),
  reset: () => set({ page: 1, pageSize: 10, filters: {}, sort: null }),
}));