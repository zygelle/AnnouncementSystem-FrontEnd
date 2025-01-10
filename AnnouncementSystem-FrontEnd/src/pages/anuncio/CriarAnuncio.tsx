import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhotoUpload from '../../components/PhotoUpload.tsx';
import Select from "react-select";
import {Category, CategorySchema, City, CitySchema } from "../../schema/AdSchema.tsx";
import api from '../../services/api.tsx';
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from 'uuid';
import { pathHome, setPathVisualizarAnuncio } from "../../routers/Paths.tsx";
import { AdSchema, createAd, createAdSchema } from "../../schema/AdSchema.tsx";
import { useForm } from "react-hook-form";
import { storage } from '../../services/firebaseConfig.tsx';
import { ref, uploadBytesResumable } from "firebase/storage";

export function CriarAnuncio(){
    const [images, setImages] = useState<File[]>([]);
    const [isImages, setIsImages] = useState<boolean>(false);
    const [nomeArquivo, setNomeArquivo] = useState<string>('');
    const navigate = useNavigate();
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

    useEffect(() => {
            fetchCities()
            fetchCategory()
            setNomeArquivo(v4().toString())
        }, []);

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

    const handleUpload = async (images: File[]): Promise<string> => {
        const uploadPromises = images.map((image) => {
            const uniqueName = `${nomeArquivo}/${image.name}_${v4()}`;
            const storageRef = ref(storage, uniqueName);
    
            return new Promise<void>((resolve, reject) => {
                const uploadTask = uploadBytesResumable(storageRef, image);
    
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Upload de ${image.name}: ${progress.toFixed(2)}% concluído.`);
                    },
                    (error) => {
                        console.error(`Erro ao fazer upload de ${image.name}:`, error);
                        reject(error);
                    },
                    () => {
                        console.log(`Upload de ${image.name} concluído.`);
                        resolve();
                    }
                );
            });
        });

        try {
            await Promise.all(uploadPromises);
            console.log("Todos os uploads foram concluídos com sucesso.");
            return nomeArquivo;
        } catch (error) {
            console.error("Erro durante o upload de uma ou mais imagens:", error);
            throw new Error("Erro durante o upload. Processo interrompido.");
        }
    };

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
        }
    }

    async function criar(e: createAd) {
        try {
            if (isImages && images.length>0) {
                const nome = await handleUpload(images);
                e.imageArchive = nome;
            }

            saveDatabase(e);
        } catch (error) {
            console.error("Erro ao criar anúncio:", error);
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
                                        {...register("city")}
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
                                        {...register("categories")}
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
                                    type="reset"
                                    className="h-9 hover:bg-slate-200 rounded border-slate-200 border-2 text-lg px-4">
                                    Cancelar
                                </button>
                                <button
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