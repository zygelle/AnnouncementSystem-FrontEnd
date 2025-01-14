import {z} from "zod";

export const sendMessageSchema = z.object({
    chat: z.string().uuid(),
    email: z.string().email(),
    message: z.string().min(1),
});

export type SendMessage = z.infer<typeof sendMessageSchema>