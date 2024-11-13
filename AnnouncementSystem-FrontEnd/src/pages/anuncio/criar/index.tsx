import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from '../../../components/forms/Input'
import { Textarea } from '../../../components/forms/Textarea';
import CreatableSelect from 'react-select/creatable';
import PhotoUpload from '../../../components/photoUpload/PhotoUpload';

import api from '../../../services/api';
import { z } from 'zod';
import { v4 } from 'uuid';
import { pathHome } from "../../../routers/Paths";

const anuncioSchema = z.object({
    title: z.string().min(1, 'O título não pode ser vazio'),
    content: z.string().min(1, 'A descrição não pode ser vazia'),
    city: z.string().min(1, 'A cidade não pode ser vazia'),
    categories: z.array(z.string()).min(1, 'Escolha ao menos uma categoria'),
    paths: z.array(z.string()).optional(),
    price: z.number().nonnegative('O preço não pode ser negativo'),
});

export function CriarAnuncio(){
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [city, setCity] = useState('');
    const [categories, setCategories] = useState([]);
    const [imageArchive, setImageArchive] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');

    const [nomeArquivo, setNomeArquivo] = useState<string>('');
    useEffect(() => { setNomeArquivo(v4().toString()) }, []);

    const handleChangeCategories = (selectedOptions) => {
        setCategories(selectedOptions || []);
    };

    const handleUploadComplete = (url) => {
        console.log("Essa é a url: " + url)
        setImageArchive(url);
    };

    async function criar(e) {
        e.preventDefault();

        const categoriesValues = categories.map(option => option.value);

        const data = {
            title,
            content,
            city,
            categories: categoriesValues,
            price: parseFloat(price),
            imageArchive,
        }

        const result = anuncioSchema.safeParse(data);
        if (!result.success) {
            const errorMessages = result.error.format();
            setErrors(errorMessages);
            return;
        }

        console.log('Payload enviado:', data);

        try {
            console.log('Imagem:' + data.imageArchive)
            await api.post('announcement/create', data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            alert("Anúncio salvo com sucesso");
            navigate(pathHome);
            
            setTitle('');
            setContent('');
            setCity('');
            setCategories([]);
            setImageArchive('');
            setPrice('');
        } catch (error) {
            alert("Erro ao criar anúncio");
        }
    }

    return (
        <div className="flex flex-col bg-slate-100 items-center justify-center">
            <main className="w-full max-w-3xl flex flex-col p-8 rounded-lg bg-white shadow-2x mb-20">
                <div className="flex flex-col items-center mb-6">
                    <PhotoUpload
                        nomeArquivo={nomeArquivo}
                        onUploadComplete={handleUploadComplete}
                    />
                </div>
                <div className="gap-2.5 mt-5 max-w-full">
                    <form onSubmit={criar} className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="mb-2">Título</label>
                                <Input
                                    className='w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4'
                                    placeholder='Título'
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                {errors.title && <span className='text-red-600'>{errors.title._errors}</span>}
                            </div>
                            <div>
                                <label className="mb-2">Descrição do Anúncio</label>
                                <Textarea 
                                    rows="4"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                {errors.content && <span className='text-red-600'>{errors.content._errors}</span>}
                            </div>
                            <div>
                                <label className="mb-2">Localização</label>
                                <Input
                                    className='w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4'
                                    placeholder='Cidade'
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                                {errors.city && <span className='text-red-600'>{errors.city._errors}</span>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="mb-2">Categorias</label>
                                <CreatableSelect 
                                    isClearable 
                                    isMulti 
                                    className="mb-2"
                                    onChange={handleChangeCategories} 
                                    placeholder="Categorias"
                                />
                                {errors.categories && <span className='text-red-600'>{errors.categories._errors}</span>}
                            </div>
                            <div>
                                <label className="mb-2">Preço (R$)</label>
                                <Input
                                    className='w-full border border-slate-300 h-9 rounded-md outline-none px-2 mb-4'
                                    placeholder="0.0"
                                    step={.01}
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                                {errors.price && <span className='text-red-600'>{errors.price._errors}</span>}
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
            </main>
        </div>
    );
}