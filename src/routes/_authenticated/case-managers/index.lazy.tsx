import { createLazyFileRoute } from '@tanstack/react-router';
import CaseManagers from '@/features/case-managers'; 

export const Route = createLazyFileRoute('/_authenticated/case-managers/')({
  component: CaseManagers,
});