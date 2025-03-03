import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhotoUpload from '../../components/PhotoUpload.tsx';
import Select from "react-select";
import {Category, City} from "../../schema/AdSchema.tsx";
import api from '../../services/api/api.tsx';
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from 'uuid';
import { pathHome, setPathVisualizarAnuncio } from "../../routers/Paths.tsx";
import { AdSchema } from "../../schema/AdSchema.tsx";
import { useForm } from "react-hook-form";
import {loadCities} from "../../utils/loadCities.tsx";
import {loadCategories} from "../../utils/loadCategories.tsx";
import {handleUpload} from "../../services/firebase/handleUpload.tsx";
import {createAd, createAdSchema} from "../../schema/CreateAdSchema.tsx";

export function CriarAnuncio(){
    const [images, setImages] = useState<File[]>([]);
    const [isImages, setIsImages] = useState<boolean>(false);
    const [nomeArquivo, setNomeArquivo] = useState<string>('');
    const navigate = useNavigate();
    const [isEnable, setEnable] = useState<boolean>(false);
    const [cityOptions, setCityOptions] = useState<City[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
    const categorySelectOptions = categoryOptions.map(category => ({
            value: category.id,
            label: category.name
        }));
    const citySelectOptions = cityOptions.map(city => ({
            value: city.id,
            label: city.name
        }));
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<createAd>({
        resolver: zodResolver(createAdSchema),
        defaultValues: {
            title: "",
            content: "",
            price: 0,
            city: "",
            categories: [],
            imageArchive: "",
        },
    });


    useEffect(() => {
        loadCities(setCityOptions).catch((error) => {
            console.error("Erro ao buscar cidades: " + error)
        })
        loadCategories(setCategoryOptions).catch((error) => {
            console.error("Erro ao buscar categorias: " + error)
        })
        setNomeArquivo(v4().toString())
    }, []);

    async function saveDatabase(e:createAd) {
        const result = createAdSchema.safeParse(e);
        if (!result.success) {
            console.log(result.error);
            return;
        }
        try {
            const response = await api.post('announcement/create', e);
            const data = AdSchema.safeParse(response.data);
            if(data.success) {
                navigate(setPathVisualizarAnuncio(data.data.id));
            } else {
                console.log("Erro ao validar resposta do servidor.");
                navigate(pathHome);
            }
            
        } catch (error) {
            alert("Erro ao criar anúncio");
            console.error("Erro ao criar anúncio: " + error)
        }
    }

    async function criar(e: createAd) {
        try {
            setEnable(true);
            if (isImages && images.length>0) {
                e.imageArchive = await handleUpload(images, nomeArquivo);
            }

            saveDatabase(e).catch((error) => {
                console.error("Erro ao salvar anúncio: " + error)
            });
        } catch (error) {
            console.error("Erro ao criar anúncio: ", error);
        }
    }

    return (
        <main>
            <div className="flex flex-col items-center justify-center">
                <div className="w-full flex flex-col p-2 rounded-lg shadow-2x">
                    <div className="flex flex-col items-center mb-6">
                        <PhotoUpload
                            Images={setImages}
                            isImages={setIsImages}
                        />
                    </div>
                    <div className="gap-2.5 mt-2 max-w-full">
                        <form onSubmit={handleSubmit(criar)} className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
                                <div>
                                    <label id="title" className="mb-2">Título</label>
                                    <input
                                        {...register("title")}
                                        aria-labelledby="title"
                                        className="w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4"
                                        placeholder="Título"
                                    />
                                    {errors.title && <span className="text-red-600">{errors.title.message}</span>}
                                </div>
                                <div>
                                    <label id="description" className="mb-2">Descrição do Anúncio</label>
                                    <textarea
                                        {...register("content")}
                                        aria-labelledby="description"
                                        rows={4}
                                        className="block p-2 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:outline-slate-300"
                                    />
                                    {errors.content && <span className='text-red-600'>{errors.content.message}</span>}
                                </div>
                                <div>
                                    <label id="location" className="mb-2">Localização</label>
                                    <Select
                                        {...register("city")}
                                        aria-labelledby="location"
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
                                    <label id="categories" className="mb-2">Categorias</label>
                                    <Select
                                        {...register("categories")}
                                        aria-labelledby="categories"
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
                                    <label id="price" className="mb-2">Preço (R$)</label>
                                    <input
                                        {...register("price", {valueAsNumber: true})}
                                        aria-labelledby="price"
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
                                    onClick={() => {navigate(pathHome)}}
                                    type="reset"
                                    className="h-9 hover:bg-slate-200 rounded border-slate-200 border-2 text-lg px-4">
                                    Cancelar
                                </button>
                                <button
                                    disabled={isEnable}
                                    type="submit"
                                    className="h-9 bg-blue-900 hover:bg-blue-700 rounded border-0 text-lg text-white px-4">
                                    Anunciar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}