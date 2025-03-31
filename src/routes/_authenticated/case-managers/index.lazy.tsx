import { createLazyFileRoute } from '@tanstack/react-router';
import CaseManagersPage from '@/features/case-managers/';

export const Route = createLazyFileRoute('/_authenticated/case-managers/')({
  component: CaseManagersPage,
});