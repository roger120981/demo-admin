// _authenticated/participants/$id.tsx
import { createFileRoute } from '@tanstack/react-router'
import { CaregiversDetails } from '@/features/caregivers/components/caregivers-details'

export const Route = createFileRoute('/_authenticated/caregivers/$id')({
  component: CaregiversDetails,
})
