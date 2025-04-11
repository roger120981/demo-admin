import { z } from 'zod';

const agencySchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Agency = z.infer<typeof agencySchema>;
export const agencyListSchema = z.array(agencySchema);

export const agencyFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
});

export type AgencyForm = z.infer<typeof agencyFormSchema>;