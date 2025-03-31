import { createLazyFileRoute } from '@tanstack/react-router';
import CaregiversPage from '@/features/caregivers/';

export const Route = createLazyFileRoute('/_authenticated/caregivers/')({
  component: CaregiversPage,
});