import { z } from 'zod';

// Esquema para validação de mensagens recebidas
export const receiveMessageSchema = z.object({
    id: z.string().uuid(), // ID da mensagem
    message: z.string().min(1), // Corrigido de "content" para "message"
    sender: z.object({
        email: z.string().email(), // E-mail do remetente
        name: z.string().min(1), // Nome do remetente
    }),
    date: z.string(), // Corrigido para aceitar strings diretamente
});

export type reciveMessage = z.infer<typeof receiveMessageSchema>

// Esquema para envio de mensagens
export const sendMessageSchema = z.object({
    chat: z.string().uuid(), // ID do chat
    email: z.string().email(),
    message: z.string().min(1), // Conteúdo da mensagem
});

export type SendMessage = z.infer<typeof sendMessageSchema>
