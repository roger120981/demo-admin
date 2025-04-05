// _authenticated/participants/$id.tsx
import { createFileRoute } from '@tanstack/react-router'
import { ParticipantDetails } from '@/features/participants/components/participant-details'

export const Route = createFileRoute('/_authenticated/participants/$id')({
  component: ParticipantDetails,
})
