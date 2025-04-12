import { z } from 'zod';

const caregiverSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Caregiver = z.infer<typeof caregiverSchema>;
export const caregiverListSchema = z.array(caregiverSchema);

export const caregiverFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Invalid email.' }).optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CaregiverForm = z.infer<typeof caregiverFormSchema>;