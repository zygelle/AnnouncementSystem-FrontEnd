import {z} from "zod";

export const receiveMessageSchema = z.object({
    id: z.string().uuid(),
    message: z.string().min(1),
    sender: z.object({
        email: z.string().email(),
        name: z.string().min(1),
    }),
    date: z.string(),
});

export type receiveMessage = z.infer<typeof receiveMessageSchema>