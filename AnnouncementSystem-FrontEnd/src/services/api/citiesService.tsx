import api from "./api.tsx";
import {City, CitySchema} from "../../schema/AdSchema.tsx";

export const fetchCities = async (): Promise<{ success: boolean; data?: City[]; error?: string }> => {
    const message = "Erro ao carregar cidades. Por favor, tente novamente mais tarde.";
    try {
        const response = await api.get("/city");
        const citiesData: City[] = response.data;

        const cities = citiesData.map((city) => {
            return CitySchema.parse(city);
        });

        return { success: true, data: cities };
    } catch (error) {
        console.error("Erro ao carregar cidades:", error);
        return { success: false, error: message };
    }
};