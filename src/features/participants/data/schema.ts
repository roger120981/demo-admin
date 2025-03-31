import { z } from 'zod';

const participantSchema = z.object({
  id: z.number(),
  name: z.string(),
  gender: z.string(),
  medicaidId: z.string(),
  dob: z.string(),
  location: z.string(),
  community: z.string(),
  address: z.string(),
  primaryPhone: z.string(),
  secondaryPhone: z.string().optional(),
  isActive: z.boolean(),
  locStartDate: z.string(),
  locEndDate: z.string(),
  pocStartDate: z.string(),
  pocEndDate: z.string(),
  units: z.number(),
  hours: z.number(),
  hdm: z.boolean(),
  adhc: z.boolean(),
  cmID: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Participant = z.infer<typeof participantSchema>;
export const participantListSchema = z.array(participantSchema);

export const participantFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  gender: z.string().min(1, { message: 'Gender is required.' }),
  medicaidId: z.string().min(1, { message: 'Medicaid ID is required.' }),
  dob: z.string().min(1, { message: 'Date of birth is required.' }),
  location: z.string().min(1, { message: 'Location is required.' }),
  community: z.string().min(1, { message: 'Community is required.' }),
  address: z.string().min(1, { message: 'Address is required.' }),
  primaryPhone: z.string().min(1, { message: 'Primary phone is required.' }),
  secondaryPhone: z.string().optional(),
  isActive: z.boolean(),
  locStartDate: z.string().min(1, { message: 'Location start date is required.' }),
  locEndDate: z.string().min(1, { message: 'Location end date is required.' }),
  pocStartDate: z.string().min(1, { message: 'POC start date is required.' }),
  pocEndDate: z.string().min(1, { message: 'POC end date is required.' }),
  units: z.number().min(0, { message: 'Units must be a positive number.' }),
  hours: z.number().min(0, { message: 'Hours must be a positive number.' }),
  hdm: z.boolean(),
  adhc: z.boolean(),
  caseManager: z.object({
    connect: z.object({ id: z.number() }).optional(),
    create: z.object({
      name: z.string().min(1, { message: 'Case manager name is required.' }),
      email: z.string().email({ message: 'Invalid email.' }).optional(),
      phone: z.string().optional(),
      agencyId: z.number().min(1, { message: 'Agency is required.' }),
    }).optional(),
  }).refine((data) => data.connect || data.create, {
    message: 'Must either connect or create a case manager.',
    path: ['caseManager'],
  }),
  caregiverIds: z.array(z.number()).optional(),
});

export type ParticipantForm = z.infer<typeof participantFormSchema>;