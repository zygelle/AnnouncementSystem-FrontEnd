import {z} from "zod";

export const createAdSchema = z.object({
    title: z.string().min(1, {message: "Título é obrigatório"}),
    content: z.string().min(1, {message: "Descrição é obrigatória"}),
    price: z.preprocess(
        (value) => parseFloat(String(value)),
        z.number().nonnegative({message: "O preço deve ser não negativo"})
    ),
    city: z.string().min(1, {message: "Cidade é obrigatória"}),
    categories: z.array(z.string()).min(1, {message: "Selecione pelo menos uma categoria"}),
    imageArchive: z.string().nullable().optional(),
});

export type createAd = z.infer<typeof createAdSchema>;