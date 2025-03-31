import { createLazyFileRoute } from '@tanstack/react-router';
import  Participant from '@/features/participants';

export const Route = createLazyFileRoute('/_authenticated/participants/')({
  component: Participant,
});