import { z } from 'zod';

const caseManagerSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  agencyId: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CaseManager = z.infer<typeof caseManagerSchema>;
export const caseManagerListSchema = z.array(caseManagerSchema);

export const caseManagerFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Invalid email.' }).optional(),
  phone: z.string().optional(),
  agencyId: z.number().min(1, { message: 'Agency is required.' }),
});

export type CaseManagerForm = z.infer<typeof caseManagerFormSchema>;