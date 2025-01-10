import { z } from 'zod';

export const userSchema = z.object({
    email: z.string().min(1),
    name: z.string().min(1),
    icon: z.string().min(1),
    type: z.string().min(1),
    score: z.number().min(0),
    numAssessment: z.number().int().min(0),
    role: z.string().min(1),
    deleteDate: z.string().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;