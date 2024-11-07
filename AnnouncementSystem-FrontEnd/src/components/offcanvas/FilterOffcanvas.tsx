import React, { useState } from "react";
import {FilterRequest} from "../schema/AdSchema.tsx";

interface FilterOffcanvasProps {
    onApplyFilters: (filter: FilterRequest) => void;
    onClose: () => void;
}

const FilterOffcanvas: React.FC<FilterOffcanvasProps> = ({ onApplyFilters, onClose }) => {
    const [filter, setFilter] = useState<FilterRequest>({
        title: "",
        content: "",
        cities: null,
        categories: null,
        minPrice: null,
        maxPrice: null,
        userType: null,
    });

    const handleApplyFilters = () => {
        onApplyFilters(filter);
        onClose();
    };

    return (
        <div
            className={`fixed top-0 right-0 w-96 h-full bg-white shadow-lg transform transition-all duration-300 ease-in-out ${true ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-semibold">Filtros</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    Fechar
                </button>
            </div>

            <div className="p-4">

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Categorias</label>
                        <select
                            multiple
                            className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="cat1">Categoria 1</option>
                            <option value="cat2">Categoria 2</option>
                            <option value="cat3">Categoria 3</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cidades</label>
                        <select
                            multiple
                            className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="cidade1">Cidade 1</option>
                            <option value="cidade2">Cidade 2</option>
                            <option value="cidade3">Cidade 3</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4">
                    <button onClick={handleApplyFilters} className="btn-primary w-full">
                        Aplicar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterOffcanvas;
