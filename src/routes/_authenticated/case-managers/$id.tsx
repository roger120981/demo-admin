// _authenticated/participants/$id.tsx
import { createFileRoute } from '@tanstack/react-router'
import { CaseManagersDetails } from '@/features/case-managers/components/case-managers-details'

export const Route = createFileRoute('/_authenticated/case-managers/$id')({
  component: CaseManagersDetails,
})
