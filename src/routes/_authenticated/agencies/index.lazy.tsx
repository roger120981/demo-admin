import { createLazyFileRoute } from '@tanstack/react-router';
import AgenciesPage from '@/features/agencies/';

export const Route = createLazyFileRoute('/_authenticated/agencies/')({
  component: AgenciesPage,
});