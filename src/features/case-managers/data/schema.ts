import { z } from 'zod';

const agencySchema = z.object({
  id: z.number(),
  name: z.string(),
});

const caseManagerSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  agencyId: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  agency: agencySchema.optional(),
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