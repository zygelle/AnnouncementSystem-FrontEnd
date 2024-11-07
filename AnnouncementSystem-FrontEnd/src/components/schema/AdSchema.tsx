import { z } from "zod";

export const FilterRequestSchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    cities: z.array(z.string()).nullable().optional(),
    categories: z.array(z.string()).nullable().optional(),
    minPrice: z.number().nullable().optional(),
    maxPrice: z.number().nullable().optional(),
    userType: z.string().nullable().optional(),
});

export type FilterRequest = z.infer<typeof FilterRequestSchema>;

export const CategorySchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const CitySchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const AuthorSchema = z.object({
    email: z.string().email(),
    nome: z.string(),
});

export const FileSchema = z.object({
    id: z.string(),
    path: z.string(),
});

export const AdSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    price: z.number(),
    date: z.string(),
    status: z.string(),
    author: AuthorSchema,
    city: CitySchema,
    categories: z.array(CategorySchema),
    files: z.array(FileSchema),
});

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

export type Ad = z.infer<typeof AdSchema>;