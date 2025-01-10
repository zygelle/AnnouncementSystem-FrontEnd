import {useCallback, useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import PhotoUpload from '../../components/PhotoUpload.tsx';
import Select from "react-select";
import { Category, City} from "../../schema/AdSchema";
import api from '../../services/api/api.tsx';
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from 'uuid';
import { pathHome, setPathVisualizarAnuncio } from "../../routers/Paths";
import { AdSchema} from "../../schema/AdSchema";
import { useForm } from "react-hook-form";
import {loadCities} from "../../utils/loadCities.tsx";
import {loadCategories} from "../../utils/loadCategories.tsx";
import {handleUpload} from "../../services/firebase/handleUpload.tsx";
import {createAd, createAdSchema} from "../../schema/CreateAdSchema.tsx";

export function EditarAnuncio() {
    const { id } = useParams();
    const [images, setImages] = useState<File[]>([]);
    const [isImages, setIsImages] = useState<boolean>(false);
    const [nomeArquivo, setNomeArquivo] = useState<string>('');
    const [cityOptions, setCityOptions] = useState<City[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
    const navigate = useNavigate();
    const categorySelectOptions = categoryOptions.map(category => ({
        value: category.id,
        label: category.name
    }));
    const citySelectOptions = cityOptions.map(city => ({
        value: city.id,
        label: city.name
    }));
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<createAd>({
        resolver: zodResolver(createAdSchema),
    });

    const fetchAdDetails = useCallback(async () => {
        if (id) {
            try {
                const response = await api.get(`/announcement/${id}`);
                const adData = AdSchema.parse(response.data);

                setValue("title", adData.title);
                setValue("content", adData.content);
                if (adData.price) setValue("price", adData.price);
                setValue("city", adData.city.id);
                setValue("categories", adData.categories.map((cat) => cat.id));
            } catch (error) {
                console.error("Erro ao carregar os dados do anúncio:", error);
            }
        }
    }, [id, setValue]);

    useEffect(() => {
        loadCities(setCityOptions).catch((error) => {
            console.error("Erro ao buscar cidades: " + error);
        });
        loadCategories(setCategoryOptions).catch((error) => {
            console.error("Erro ao buscar categorias: " + error);
        });

        setNomeArquivo(v4().toString());

        fetchAdDetails().catch((error) => {
            console.log("Erro ao buscar detalhes do anúncio: " + error);
        });
    }, [id, fetchAdDetails]);

    const editar = async (e: createAd) => {
        try {
            if (isImages && images.length > 0) {
                e.imageArchive = await handleUpload(images, nomeArquivo);
            }

            const result = createAdSchema.safeParse(e);
            if (!result.success) {
                console.log(result.error);
                return;
            }

            const response = await api.post(`/announcement/edit/${id}`, e);
            const data = AdSchema.safeParse(response.data);

            if (data.success) {
                navigate(setPathVisualizarAnuncio(data.data.id));
            } else {
                console.log("Erro ao validar resposta do servidor.");
                navigate(pathHome);
            }
        } catch (error) {
            console.error("Erro ao editar anúncio:", error);
        }
    };

    return (
        <main>
            <div className="flex flex-colitems-center justify-center">
                <div className="w-full flex flex-col p-2 rounded-lg shadow-2x">
                    <div className="flex flex-col items-center mb-6">
                        <PhotoUpload
                            Images={setImages}
                            isImages={setIsImages}
                        />
                    </div>
                    <div className="gap-2.5 mt-2 max-w-full">
                        <form onSubmit={handleSubmit(editar)} className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
                                <div>
                                    <label className="mb-2">Título</label>
                                    <input
                                        {...register("title")}
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                        placeholder="Título"
                                    />
                                    {errors.title && <span className="text-red-600">{errors.title.message}</span>}
                                </div>
                                <div>
                                    <label className="mb-2">Descrição do Anúncio</label>
                                    <textarea
                                        {...register("content")}
                                        rows={4}
                                        className="block p-2 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:outline-slate-300"
                                    />
                                    {errors.content && <span className='text-red-600'>{errors.content.message}</span>}
                                </div>
                                <div>
                                    <label className="mb-2">Localização</label>
                                    <Select
                                        value={citySelectOptions.find(option => option.value === watch("city"))}
                                        options={citySelectOptions}
                                        onChange={(selectedOption) => {
                                            setValue("city", selectedOption ? selectedOption.value : '');
                                        }}
                                        className="input"
                                        placeholder="Selecione a cidade"
                                        menuPosition="fixed"
                                    />
                                    {errors.city && <span className='text-red-600'>{errors.city.message}</span>}
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
                                <div>
                                    <label className="mb-2">Categorias</label>
                                    <Select
                                        value={categorySelectOptions.filter(option => watch("categories")?.includes(option.value))}
                                        options={categorySelectOptions}
                                        isMulti
                                        onChange={(selectedOptions) => {
                                            const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                            setValue("categories", selectedValues);
                                        }}
                                        className="input"
                                        placeholder="Selecione as categorias"
                                    />
                                    {errors.categories &&
                                        <span className='text-red-600'>{errors.categories.message}</span>}
                                </div>
                                <div>
                                    <label className="mb-2">Preço (R$)</label>
                                    <input
                                        {...register("price", {valueAsNumber: true})}
                                        className='w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4'
                                        placeholder="0.0"
                                        step={.01}
                                        defaultValue={0}
                                        type="number"
                                    />
                                    {errors.price && <span className='text-red-600'>{errors.price.message}</span>}
                                </div>
                            </div>
                            <div className="col-span-2 flex justify-center gap-4">
                                <button
                                    onClick={() => {
                                        if (id) {
                                            navigate(setPathVisualizarAnuncio(id));
                                        } else {
                                            console.error('ID está indefinido!');
                                        }
                                    }}
                                    className="h-9 hover:bg-slate-200 rounded border-slate-200 border-2 text-lg px-4">
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="h-9 bg-blue-900 hover:bg-blue-700 rounded border-0 text-lg text-white px-4">
                                    Editar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
