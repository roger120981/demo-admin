import { createLazyFileRoute } from '@tanstack/react-router';
import Caregivers from '@/features/caregivers'; ;

export const Route = createLazyFileRoute('/_authenticated/caregivers/')({
  component: Caregivers,
});