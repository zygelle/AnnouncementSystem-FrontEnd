import {z} from "zod";

export const createAssessmentSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    grade: z.number().min(0),
    chat: z.string().uuid(),
});

export type CreateAssessment = z.infer<typeof createAssessmentSchema>;