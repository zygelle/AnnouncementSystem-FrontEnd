import React, {useEffect, useState} from "react";
import {Category, CategorySchema, City, CitySchema, FilterRequest, FilterRequestSchema} from "../schema/AdSchema.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import api from "../services/api.tsx";
import Select from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface FilterOffcanvasProps {
    onApplyFilters: (filter: FilterRequest) => void;
    onClose: () => void;
    isOpen: boolean;
    currentFilters: FilterRequest;
}

const FilterOffcanvas: React.FC<FilterOffcanvasProps> = ({ onApplyFilters, onClose, isOpen, currentFilters}) => {

    const { register, handleSubmit, formState: { errors }, setValue,  watch} = useForm<FilterRequest>({
        resolver: zodResolver(FilterRequestSchema),
        defaultValues: {
            title: "",
            content: "",
            cities: null,
            categories: null,
            minPrice: null,
            maxPrice: null,
            userType: null,
        }
    });

    useEffect(() => {
        if (isOpen && currentFilters) {
            setValue("title", currentFilters.title);
            setValue("content", currentFilters.content);
            setValue("cities", currentFilters.cities);
            setValue("categories", currentFilters.categories);
            setValue("minPrice", currentFilters.minPrice);
            setValue("maxPrice", currentFilters.maxPrice);
            setValue("userType", currentFilters.userType);
        }
    }, [isOpen, currentFilters, setValue]);


    const typeUserOptions = [
        { value: "STUDENT", label: "Aluno(a)" },
        { value: "TEACHER", label: "Professor(a)" },
        { value: "EMPLOYEE", label: "Funcionário(s)" }
    ];

    const [cityOptions, setCityOptions] = useState<City[]>([]);

    const fetchCities = async () => {
        try {
            const response = await api.get("/city");

            const citiesData: City[] = response.data;

            const cities = citiesData.map((city) => {
                return CitySchema.parse(city);
            });
            setCityOptions(cities);
        } catch (error) {
            console.error("Erro ao carregar cidades:", error);
        }
    };

    const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);


    const categorySelectOptions = categoryOptions.map(category => ({
        value: category.id,
        label: category.name
    }));

    const fetchCategory = async () => {
        try {
            const response = await api.get("/category");

            const categoriesData: Category[] = response.data;

            const categories = categoriesData.map((categories) => {
                return CategorySchema.parse(categories);
            });
            setCategoryOptions(categories);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    };

    const citySelectOptions = cityOptions.map(city => ({
        value: city.id,
        label: city.name
    }));

    useEffect(() => {
        fetchCities()
        fetchCategory()
    }, [isOpen]);

    const handleApplyFilters = (data: FilterRequest) => {
        onApplyFilters(data);
        onClose();
    };

    return (
        <div
            className={`fixed top-0 right-0 w-96 h-screen bg-white shadow-lg transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ overflowY: 'auto' }}
        >
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-semibold">Filtros</h3>
                <button
                    onClick={() => {
                        onClose();
                    }}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Fechar"
                >
                    <FontAwesomeIcon icon={faXmark} className="w-6 h-6"/>
                </button>

            </div>

            <form onSubmit={handleSubmit(handleApplyFilters)} className="p-5 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input
                        {...register("title")}
                        type="text"
                        className="border border-slate-300 h-9 rounded-md outline-none p-2 w-full"
                        placeholder="Digite o título"
                    />
                    {errors.title && <span className="text-red-500">{errors.title.message}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Conteúdo</label>
                    <input
                        {...register("content")}
                        type="text"
                        className="border border-slate-300 h-9 rounded-md outline-none p-2 w-full"
                        placeholder="Digite o conteúdo"
                    />
                    {errors.content && <span className="text-red-500">{errors.content.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Cidades</label>
                    <Select
                        {...register("cities")}
                        options={citySelectOptions}
                        isMulti
                        value={citySelectOptions.filter(option =>
                            watch("cities")?.includes(option.value)
                        )}
                        onChange={(selectedOptions) => {
                            const selectedValues = selectedOptions.map(option => option.value);
                            setValue("cities", selectedValues);
                        }}
                        className="input"
                        placeholder="Selecione as cidades"
                    />
                    {errors.cities && <span className="text-red-500">{errors.cities.message}</span>}
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700">Categorias</label>
                    <Select
                        {...register("categories")}
                        options={categorySelectOptions}
                        isMulti
                        value={categorySelectOptions.filter(option =>
                            watch("categories")?.includes(option.value)
                        )}
                        onChange={(selectedOptions) => {
                            const selectedValues = selectedOptions.map(option => option.value);
                            setValue("categories", selectedValues);
                        }}
                        className="input"
                        placeholder="Selecione as categorias"
                    />
                    {errors.categories && <span className="text-red-500">{errors.categories.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Preço Mínimo</label>
                    <input
                        {...register("minPrice", {
                            valueAsNumber: true,
                            onChange: (e) => {
                                const value = e.target.value === "" ? null : parseFloat(e.target.value);
                                setValue("minPrice", value);
                            }
                        })}
                        type="number"
                        min="0"
                        className="mt-1 block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm placeholder-gray-400"
                        placeholder="Preço mínimo"
                    />
                    {errors.minPrice && (
                        <span className="text-red-500 text-sm mt-1">{errors.minPrice.message}</span>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Preço Máximo</label>
                    <input
                        {...register("maxPrice", {
                            valueAsNumber: true,
                            onChange: (e) => {
                                const value = e.target.value === "" ? null : parseFloat(e.target.value);
                                setValue("maxPrice", value);
                            }
                        })}
                        type="number"
                        min="0"
                        className="mt-1 block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm placeholder-gray-400"
                        placeholder="Preço máximo"
                    />
                    {errors.maxPrice && (
                        <span className="text-red-500 text-sm mt-1">{errors.maxPrice.message}</span>
                    )}
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Usuário</label>
                    <Select
                        {...register("userType")}
                        options={typeUserOptions}
                        value={typeUserOptions.filter(option =>
                            watch("userType")?.includes(option.value)
                        )}
                        onChange={(selectedOption) => {
                            setValue('userType', selectedOption ? selectedOption.value : null); // Atualiza o valor do tipo de usuário
                        }}
                        className="input"
                        placeholder="Selecione o tipo de usuário"
                    />
                    {errors.userType && <span className="text-red-500">{errors.userType.message}</span>}
                </div>
                <div className="mt-4">
                    <button type="submit" className="btn-primary w-full">Aplicar Filtros</button>
                </div>
            </form>
        </div>
    );
};

export default FilterOffcanvas;
