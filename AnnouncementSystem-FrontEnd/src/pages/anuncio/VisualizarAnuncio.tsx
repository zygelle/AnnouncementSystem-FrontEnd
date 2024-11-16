import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Ad, AdSchema} from "../../schema/AdSchema.tsx";
import api from "../../services/api.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStarHalfStroke, faTag} from "@fortawesome/free-solid-svg-icons";
import {getDownloadURL, listAll, ref} from "firebase/storage";
import {storage} from "../../services/firebaseConfig.tsx";

function VisualizarAnuncio() {

    const { id } = useParams();
    const [ad, setAd] = useState<Ad>();
    const [error, setError] = useState<string>("");
    const [imgPerfil, setImgPerfil] = useState<string>('/images/img-padrao.PNG');
    const [images, setImagens] = useState<string[]>([]);
    const defaultImage = "/images/img-padrao.PNG";
    const [selectedImage, setSelectedImage] = useState<string>(defaultImage);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };
    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const visibleImages = images.slice(currentIndex, currentIndex + 3);

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        return new Date(date).toLocaleDateString('pt-BR', options);
    };
    const formatScore = (score: number) => {
        return score.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    };

    const fetchImages = (nomeArquivo: string | null | undefined) => {
        if(!nomeArquivo){
            return
        }
        const imageListRef = ref(storage, `${nomeArquivo}/`);
        listAll(imageListRef)
            .then((response) => {
                if (response.items.length > 0) {
                    Promise.all(
                        response.items.map((item) => getDownloadURL(item))
                    ).then((urls) => {
                        setImagens(urls);
                        setSelectedImage(urls[0])
                    });
                } else {
                    console.log("Nenhuma imagem encontrada.");
                }
            })
            .catch((error) => {
                console.error("Erro ao buscar as imagens:", error);
            });
    };
    const fetchImgPerfil = (img: string | null | undefined) => {
        if (!img) {
            return;
        }
        const imageRef = ref(storage, img);
        getDownloadURL(imageRef).then((url) => {
            setImgPerfil(url);
        }).catch(error => {
            console.error("Erro ao buscar a imagem:", error);
        });
    };
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
            fetchImgPerfil(parsedResult.data.author.icon)
            fetchImages(parsedResult.data.imageArchive)
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

    return (
        <main className="main-layout">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="grid grid-cols-2 text-sm md:order-2">
                    <div>{ad.city.name}</div>
                    <div className="text-end">{formatDate(ad.date)}</div>
                </div>
                <div className="flex flex-col items-center md:order-1 md:row-span-6">
                    <div className="mb-4">
                        <img
                            src={selectedImage}
                            alt="Imagem principal"
                            className="w-96 h-96 object-cover rounded-md"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        {currentIndex > 0 && (
                            <button
                                className="text-gray-700 hover:text-gray-900"
                                onClick={handlePrevious}
                            >
                                {"<"}
                            </button>
                        )}

                        <div className="flex space-x-3">
                            {visibleImages.length > 0
                                ? visibleImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Imagem ${index + 1}`}
                                        className={`w-20 h-20 object-cover rounded-md cursor-pointer ${
                                            selectedImage === image ? "ring-2 ring-blue-500" : ""
                                        }`}
                                        onClick={() => setSelectedImage(image)}
                                    />
                                ))
                                : (
                                    <img
                                        src={defaultImage}
                                        alt="Imagem padrão"
                                        className="w-20 h-20 object-cover rounded-md cursor-pointer"
                                        onClick={() => setSelectedImage(defaultImage)}
                                    />
                                )}
                        </div>

                        {currentIndex < images.length - 3 && (
                            <button
                                className="text-gray-700 hover:text-gray-900"
                                onClick={handleNext}
                            >
                                {">"}
                            </button>
                        )}
                    </div>
                </div>
                <div className="text-2xl font-semibold md:order-2">{ad.title}</div>
                <div className="md:order-2">
                    {ad.content}
                </div>
                <div className="flex justify-between md:order-2">
                    <div className="text-lg font-medium content-center">{
                        ad.price != null && ad.price > 0 &&
                        (<span>R$ {ad.price.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}</span>)
                    }</div>
                    <div className="flex justify-center align-middle">
                        <div className="w-16 h-16 justify-center">
                            <img
                                src={imgPerfil}
                                alt="Imagem de Perfil"
                                className="rounded-full"
                            />
                        </div>
                        <div className="flex flex-col justify-center p-1">
                            <div className="">{ad.author.name}</div>
                            <div>
                                <FontAwesomeIcon icon={faStarHalfStroke} className="me-1 text-yellow-400"/>
                                {formatScore(ad.author.score)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center md:order-2">
                    <div className="flex items-center text-xs">
                        {ad.categories.map((category, index) => (
                            <div key={index} className="">
                                <span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 me-1 rounded-full">
                                  <FontAwesomeIcon icon={faTag}/> {category?.name}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div>
                        <button className="btn-primary">
                            Contatar
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default VisualizarAnuncio;