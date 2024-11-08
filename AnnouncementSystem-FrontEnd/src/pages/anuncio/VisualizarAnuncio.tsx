import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Ad, AdSchema} from "../../schema/AdSchema.tsx";
import api from "../../services/api.tsx";

function VisualizarAnuncio() {

    const { id } = useParams();
    const [ad, setAd] = useState<Ad>();
    const [error, setError] = useState<string>("");

    async function fetchAd() {
        try {
            const response = await api.get(`/announcement/${id}`);

            if (response.status !== 200) {
                throw new Error('Falha ao buscar o anúncio');
            }
            const adData = response.data;
            if (!adData) {
                throw new Error('Dados do anúncio não encontrados');
            }
            const parsedResult = AdSchema.safeParse(adData);
            if (!parsedResult.success) {
                console.error(parsedResult.error.errors);
                throw new Error('Dados inválidos recebidos');
            }
            setAd(parsedResult.data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Erro desconhecido');
            }
        }
    }

    useEffect(() => {
        fetchAd();
    }, [id]);

    if (error) return <p className="text-red-500">Erro: {error}</p>;
    if (!ad) return <p>Carregando...</p>;

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        };
        return new Date(date).toLocaleDateString('pt-BR', options);
    };

    return (
        <main className="main-layout">

            <div className="flex w-full justify-between">
                <p className="mt-2 text-gray-600">{ad.city.name}</p>
                <p className="text-sm">
                    {formatDate(ad.date)}
                </p>
            </div>

            {ad.files && ad.files.length > 0 && (
                <div className="carousel mb-6">
                    {ad.files.map((id, path) => (
                        <img
                            src=""
                            alt={`Imagem ${id}`}
                            className="w-full object-cover rounded-md"
                        />
                    ))}
                </div>
            )}

            <div className="flex justify-center mb-3">
                <h1 className="text-2xl font-semibold text-gray-900">{ad.title}</h1>
            </div>

            <div className="flex justify-start">
                <p className="text-gray-700">{ad.content}</p>
            </div>

            {ad.price != null && ad.price > 0 && (
                <div className="flex justify-end my-2">
                    <p className="font-semibold text-gray-800">
                        R$ {ad.price.toFixed(2)}
                    </p>
                </div>
            )}

            <div className="flex justify-between">
                <p>
                    {ad.categories.map(category => category.name).join(', ')}
                </p>
                <Link to={`/author/${ad.author.email}`}
                      className="hover:underline">
                    {ad.author.name}
                </Link>
            </div>

        </main>
    );
}

export default VisualizarAnuncio;