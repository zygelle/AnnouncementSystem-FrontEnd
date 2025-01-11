import api from "./api.tsx";
import {Category, CategorySchema} from "../../schema/AdSchema.tsx";

export const fetchCategories = async (): Promise<{ success: boolean; data?: Category[]; error?: string }> => {
    const message = "Erro ao carregar categorias. Por favor, tente novamente mais tarde.";
    try {
        const response = await api.get("/category");
        const categoriesData: Category[] = response.data;

        const categories = categoriesData.map((category) => {
            return CategorySchema.parse(category);
        });

        return { success: true, data: categories };
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        return { success: false, error: message };
    }
};