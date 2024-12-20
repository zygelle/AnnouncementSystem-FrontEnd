import { z } from 'zod';

// Esquema para validação de mensagens recebidas
export const receiveMessageSchema = z.object({
    id: z.string().uuid(), // ID da mensagem
    content: z.string().min(1), // Conteúdo da mensagem
    sender: z.object({
        email: z.string().email(), // E-mail do remetente
        name: z.string().min(1), // Nome do remetente
    }),
    date: z.string().datetime(), // Data e hora da mensagem
});

// Esquema para envio de mensagens
export const sendMessageSchema = z.object({
    chat: z.string().uuid(), // ID do chat
    message: z.string().min(1), // Conteúdo da mensagem
});
