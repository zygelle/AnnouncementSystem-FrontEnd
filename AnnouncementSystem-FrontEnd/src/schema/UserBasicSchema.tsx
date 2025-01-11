import {z} from "zod";

export const userBasicSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
});

export type UserBasic = z.infer<typeof userBasicSchema>;