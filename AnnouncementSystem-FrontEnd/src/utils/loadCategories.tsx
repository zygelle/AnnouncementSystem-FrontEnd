import {Category} from "../schema/AdSchema.tsx";
import {fetchCategories} from "../services/api/categoryService.tsx";

export const loadCategories = async (setCategory: (category: Category[]) => void) => {
    const result = await fetchCategories();
    if (result.success && result.data) {
        setCategory(result.data);
    } else {
        console.error(result.error);
    }
};