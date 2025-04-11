// _authenticated/participants/$id.tsx
import { createFileRoute } from '@tanstack/react-router'
import { AgenciesDetails } from '@/features/agencies/components/agencies-details'

export const Route = createFileRoute('/_authenticated/agencies/$id')({
  component: AgenciesDetails,
})
