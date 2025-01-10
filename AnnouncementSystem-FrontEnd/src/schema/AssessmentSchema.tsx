import { z } from "zod";
import {chatSchema} from "./ChatSchema.tsx";

export const userBasicSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
});

export type UserBasic = z.infer<typeof userBasicSchema>;

export const assessmentSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1),
    description: z.string().min(1),
    grade: z.number().min(0),
    date: z.string(),
    evaluatorUser: userBasicSchema,
    ratedUser: userBasicSchema,
    chat: chatSchema,
});

export type AssessmentSchema = z.infer<typeof assessmentSchema>;

export const PaginatedAssessmentsSchema = z.object({
    content: z.array(assessmentSchema),
    pageable: z.object({
        pageNumber: z.number(),
        pageSize: z.number(),
    }),
    totalElements: z.number(),
    totalPages: z.number(),
    numberOfElements: z.number(),
});