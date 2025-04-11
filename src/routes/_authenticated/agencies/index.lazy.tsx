import { createLazyFileRoute } from '@tanstack/react-router';
import Agencies from '@/features/agencies/';

export const Route = createLazyFileRoute('/_authenticated/agencies/')({
  component: Agencies,
});