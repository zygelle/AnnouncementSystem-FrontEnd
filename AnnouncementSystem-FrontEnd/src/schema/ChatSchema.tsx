import {z} from 'zod';

export const chatSchema = z.object({
    id: z.string().uuid(),
    participant: z.object({
        email: z.string().email(),
        name: z.string(),
    }),
    announcement: z.object({
        id: z.string().uuid(),
        title: z.string(),
        imageArchive: z.string().nullable(),
        status: z.string(),
    }),
    chatStatus: z.string(),
    dateLastMessage: z.string().nullable(),
    isEvaluated: z.boolean()
});

export type Chat = z.infer<typeof chatSchema>

export const PaginatedChatSchema = z.object({
    content: z.array(chatSchema),
    pageable: z.object({
        pageNumber: z.number(),
        pageSize: z.number(),
    }),
    totalElements: z.number(),
    totalPages: z.number(),
    numberOfElements: z.number(),
});
