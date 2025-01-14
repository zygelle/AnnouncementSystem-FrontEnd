import {FilterRequest, FilterRequestSchema, PaginatedAdsSchema} from "../../schema/AdSchema.tsx";
import api from "./api.tsx";

export const fetchAdsWithFilter =
    async (filter: FilterRequest, page: number) => {
    const message:string = "Erro ao buscar anúncios. Por favor, se o error persistir tente novamente mais tarde."
    try {
        const validation = FilterRequestSchema.safeParse(filter);
        if (!validation.success) {
            console.error("Erro de validação dos dados de requisição", validation.error);
            return { success: false, error: message };
        }

        const response = await api.post(`announcement/filter?page=${page}&size=10`, validation.data);

        const parsed = PaginatedAdsSchema.safeParse(response.data);
        if (parsed.success) {
            return {
                success: true,
                data: {
                    ads: parsed.data.content,
                    totalPages: parsed.data.totalPages,
                },
            };
        } else {
            console.error("Erro de validação", parsed.error);
            return { success: false, error: message };
        }
    } catch (error) {
        console.error("Erro ao buscar os anúncios", error);
        return { success: false, error: message };
    }
};
