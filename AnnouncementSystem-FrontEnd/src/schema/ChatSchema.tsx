import { z } from 'zod';

export const receiveMessageSchema = z.object({
    id: z.string().uuid(),
    message: z.string().min(1),
    sender: z.object({
        email: z.string().email(),
        name: z.string().min(1),
    }),
    date: z.string(),
});

export type reciveMessage = z.infer<typeof receiveMessageSchema>

export const sendMessageSchema = z.object({
    chat: z.string().uuid(),
    email: z.string().email(),
    message: z.string().min(1),
});

export type SendMessage = z.infer<typeof sendMessageSchema>

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
