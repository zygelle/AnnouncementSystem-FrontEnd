import {City} from "../schema/AdSchema.tsx";
import {fetchCities} from "../services/api/citiesService.tsx";

export const loadCities = async (setCities: (cities: City[]) => void) => {
    const result = await fetchCities();
    if (result.success && result.data) {
        setCities(result.data);
    } else {
        console.error(result.error);
    }
};