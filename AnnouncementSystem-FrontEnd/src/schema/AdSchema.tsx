import {z} from "zod";

export const FilterRequestSchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    cities: z.array(z.string()).nullable().optional(),
    categories: z.array(z.string()).nullable().optional(),
    minPrice: z.number().min(0, { message: "O preço mínimo não pode ser negativo" }).nullable().optional(),
    maxPrice: z.number().min(0, { message: "O preço máximo não pode ser negativo" }).nullable().optional(),
    userType: z.string().nullable().optional(),
});

export type FilterRequest = z.infer<typeof FilterRequestSchema>;

export const CategorySchema = z.object({
    id: z.string(),
    name: z.string(),
});

export type Category = z.infer<typeof CategorySchema>

export const CitySchema = z.object({
    id: z.string(),
    name: z.string(),
});

export type City = z.infer<typeof CitySchema>

export const AuthorSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    icon: z.string().nullable().optional(),
    score: z.number()
});

export const AdSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    price: z.number().nullable().optional(),
    date: z.string(),
    deletionDate: z.string().nullable().optional(),
    status: z.string(),
    author: AuthorSchema,
    city: CitySchema,
    categories: z.array(CategorySchema),
    imageArchive: z.string().nullable().optional(),
});

export type Ad = z.infer<typeof AdSchema>;

export const PaginatedAdsSchema = z.object({
    content: z.array(AdSchema),
    pageable: z.object({
        pageNumber: z.number(),
        pageSize: z.number(),
    }),
    totalElements: z.number(),
    totalPages: z.number(),
    numberOfElements: z.number(),
});