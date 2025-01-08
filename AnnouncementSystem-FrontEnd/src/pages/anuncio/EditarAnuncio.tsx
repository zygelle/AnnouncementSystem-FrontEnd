import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PhotoUpload from '../../components/photoUpload/PhotoUpload';
import Select from "react-select";
import { Category, CategorySchema, City, CitySchema } from "../../schema/AdSchema";
import api from '../../services/api';
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from 'uuid';
import { pathHome, setPathVisualizarAnuncio } from "../../routers/Paths";
import { AdSchema, createAd, createAdSchema } from "../../schema/AdSchema";
import { useForm } from "react-hook-form";
import { storage } from '../../services/firebaseConfig';
import { ref, uploadBytesResumable } from "firebase/storage";

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

    useEffect(() => {
        fetchCities();
        fetchCategory();
        setNomeArquivo(v4().toString());

        if (id) {
            fetchAdDetails();
        }
    }, [id]);

    const fetchAdDetails = async () => {
        try {
            const response = await api.get(`/announcement/${id}`);
            const adData = AdSchema.parse(response.data);

            setValue("title", adData.title);
            setValue("content", adData.content);
            setValue("price", adData.price);
            setValue("city", adData.city.id);
            setValue("categories", adData.categories.map(cat => cat.id));
        } catch (error) {
            console.error("Erro ao carregar os dados do anúncio:", error);
        }
    };

    const fetchCategory = async () => {
        try {
            const response = await api.get("/category");
            const categoriesData: Category[] = response.data;

            const categories = categoriesData.map((category) => CategorySchema.parse(category));
            setCategoryOptions(categories);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    };

    const fetchCities = async () => {
        try {
            const response = await api.get("/city");
            const citiesData: City[] = response.data;

            const cities = citiesData.map((city) => CitySchema.parse(city));
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

    const editar = async (e: createAd) => {
        try {
            if (isImages && images.length > 0) {
                const nome = await handleUpload(images);
                e.imageArchive = nome;
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
        <div className="flex flex-col bg-slate-100 items-center justify-center">
            <main className="w-full max-w-3xl flex flex-col p-8 rounded-lg bg-white shadow-2x mb-20">
                <div className="flex flex-col items-center mb-6">
                    <PhotoUpload
                        Images={setImages}
                        isImages={setIsImages}
                    />
                </div>
                <div className="gap-2.5 mt-5 max-w-full">
                    <form onSubmit={handleSubmit(editar)} className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-4">
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
                                />
                                {errors.city && <span className='text-red-600'>{errors.city.message}</span>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
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
                                {errors.categories && <span className='text-red-600'>{errors.categories.message}</span>}
                            </div>
                            <div>
                                <label className="mb-2">Preço (R$)</label>
                                <input
                                    {...register("price", { valueAsNumber: true })}
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
                                onClick={() => {id ? navigate(setPathVisualizarAnuncio(id)) : console.error('ID está indefinido!')}}
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
            </main>
        </div>
    );
}
