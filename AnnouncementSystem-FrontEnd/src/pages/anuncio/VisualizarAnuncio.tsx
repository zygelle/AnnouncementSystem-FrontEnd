import {useNavigate, useParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {Ad, AdSchema, FilterRequest} from "../../schema/AdSchema.tsx";
import api from "../../services/api/api.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faStarHalfStroke,
    faTag,
    faEdit,
    faTrash,
    faHeart,
    faHeartCrack,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {getDownloadURL, listAll, ref} from "firebase/storage";
import {storage} from "../../services/firebase/firebaseConfig.tsx";
import {pathCommunication, pathFilterAd, pathHome, setPathViewAdvertiser} from "../../routers/Paths.tsx";
import {getEmail} from "../../services/token.tsx";
import {chatSchema} from "../../schema/ChatSchema.tsx";
import {formatDate} from "../../utils/formatDate.tsx";
import {formatScore} from "../../utils/formatScore.tsx";
import {fetchImgPerfil} from "../../services/firebase/fetchImgPerfil.tsx";

function VisualizarAnuncio() {

    const { id } = useParams();
    const [ad, setAd] = useState<Ad | null>(null);
    const [error, setError] = useState<string>("");
    const [imgPerfil, setImgPerfil] = useState<string>('/images/img-padrao.PNG');
    const [images, setImagens] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const defaultImage = "/images/img-padrao.PNG";
    const [selectedImage, setSelectedImage] = useState<string>(defaultImage);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();
    const userEmail = getEmail();

    function handleCreateChat() {
        const createChat = async () => {
            if (!ad) return;

            try {
                const response = await api.post(`/chat/${ad.id}`);
                const parsed = chatSchema.safeParse(response.data);
                if (parsed.success) {
                    navigate(pathCommunication, { state: { chat: parsed.data } });
                } else {
                    console.error("Erro de validação:", parsed.error);
                }
            } catch (error) {
                console.error("Erro ao criar o chat:", error);
            }
        };

        createChat().catch();
    }

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

    function handleAuthor(){
        if(ad && ad.author && ad.author){
            navigate(setPathViewAdvertiser(ad.author.name), {
                state: { advertiserEmail: ad.author.email }
            });
        }
        else console.log("Erro ao acessar o página do anunciante.")
    }

    function handleEdit() {
        if (ad && ad.author.email === userEmail) {
            navigate(`/anuncio/editar/${ad.id}`);
        } else {
            console.log("Você não pode editar este anúncio.");
        }
    }

    async function handleDelete() {
        if (window.confirm("Tem certeza que deseja excluir este anúncio?")) {
            try {
                const response = await api.delete(`/announcement/${id}`);
                if (response.status === 200) {
                    alert("Anúncio deletado com sucesso.");
                    navigate(pathHome);
                } else {
                    alert("Erro ao deletar o anúncio.");
                }
            } catch (error) {
                console.error("Erro ao deletar o anúncio:", error);
                alert("Erro ao deletar o anúncio. Por favor, tente novamente.");
            }
        }
    }

    function handleCategoria(id: string) {
        const filterRequest: FilterRequest = {
            title: "",
            content: "",
            cities: null,
            categories: [id],
            minPrice: null,
            maxPrice: null,
            userType: null,
        };

        navigate(pathFilterAd, {
            state: filterRequest,
        });
    }

    async function handleClose(){
        if (window.confirm("Tem certeza que deseja fechar este anúncio?")) {
            try {
                const response = await api.post(`/announcement/close/${id}`);
                if (response.status === 200) {
                    const parsedResult = AdSchema.safeParse(response.data);

                    if (parsedResult.success && parsedResult.data){
                        setAd(parsedResult.data);
                        setIsOpen(false)
                    }
                } else {
                    alert("Erro ao deletar o anúncio.");
                }
            } catch (error) {
                console.error("Erro ao deletar o anúncio:", error);
                alert("Erro ao deletar o anúncio. Por favor, tente novamente.");
            }
        }
    }

    const visibleImages = images.slice(currentIndex, currentIndex + 3);

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

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                await api.delete(`/favorite/${id}`);
                alert("Anúncio desfavoritado!");
            } else {
                await api.post(`/favorite/${id}`);
                alert("Anúncio favoritado!");
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Erro ao alterar o estado de favorito:", error);
        }
    };

    const fetchAd = useCallback(async () => {
        try {
            const response = await api.get(`/announcement/${id}`);
            if(response.status === 200){
                const parsedResult = AdSchema.safeParse(response.data);

                if (parsedResult.success && parsedResult.data) {

                    setAd(parsedResult.data);
                    fetchImgPerfil(parsedResult.data.author.icon, setImgPerfil);
                    fetchImages(parsedResult.data.imageArchive);

                    if(parsedResult.data.status === "Fechado")
                        setIsOpen(false)

                    return
                }

                else {
                    console.error(parsedResult.error)
                    setError(parsedResult.error?.message);
                }
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
                console.error(error.message)
            } else {
                setError('Erro desconhecido.');
                console.error("Erro desconhecido.")
            }
        }
    }, [id]);

    useEffect(() => {
        fetchAd().catch();

        async function checkFavorite() {
            try {
                const response = await api.get(`/favorite/${id}`);
                setIsFavorite(response.data);
            } catch (error) {
                console.error("Erro ao verificar se o anúncio é favorito:", error);
            }
        }
        checkFavorite().catch();
    }, [id, fetchAd]);

    if (error){
        return (
            <div style={{textAlign: 'center', padding: '2rem'}}>
                <h1>Ops! Algo deu errado.</h1>
                <p>Não conseguimos encontrar a página que você está procurando.</p>
            </div>
        )
    }

    return (
        <main>
            {ad ? (
                <div className={`${
                    isOpen ? "" : "pointer-events-none opacity-50"}`}>
                    <div className="flex justify-between mb-3">
                        {(ad.author.email != userEmail && isOpen) &&
                            <button
                                className="text-red-500 text-xl"
                                onClick={toggleFavorite}
                            >
                                <FontAwesomeIcon icon={isFavorite ? faHeart : faHeartCrack}/>
                            </button>
                        }
                        {(ad.author.email === userEmail && isOpen) && (
                            <div className="flex gap-3 items-center text-center w-full justify-end">
                                <div
                                    className="text-green-600 py-2 px-3 rounded-full hover:bg-green-700 cursor-pointer hover:text-white"
                                    onClick={handleEdit}
                                >
                                    <FontAwesomeIcon icon={faEdit} size="lg"/>
                                </div>
                                <div
                                    className="text-gray-600 justify-center py-2 px-3 rounded-full hover:bg-gray-700 hover:text-white"
                                    onClick={handleClose}
                                >
                                    <FontAwesomeIcon icon={faXmark} size="lg"/>
                                </div>
                                <div
                                    className="text-red-600 py-2 px-3 rounded-full hover:bg-red-700 hover:text-white"
                                    onClick={handleDelete}
                                >
                                    <FontAwesomeIcon icon={faTrash} size="lg"/>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="grid grid-cols-2 text-sm md:order-2">
                            <div>{ad.city.name}</div>
                            <div className="text-end">{formatDate(ad.date)}</div>
                        </div>
                        <div className="flex flex-col items-center md:order-1 md:row-span-5">
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
                        <div className="md:order-2 overflow-x-auto py-2">
                            {ad.content}
                        </div>
                        <div className="grid grid-cols-2 gap-2 justify-between md:order-2">
                            <div className="text-lg font-medium content-center">
                                {
                                    ad.price != null && ad.price > 0 &&
                                    (<span>R$ {ad.price.toLocaleString('pt-BR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}</span>)
                                }
                            </div>
                            <div className="flex justify-end">
                                <div
                                    className="flex items-center w-fit justify-center align-middle border-2 px-4 py-1 bg-gray-100 rounded-xl hover:cursor-pointer hover:bg-gray-300"
                                    onClick={handleAuthor}>
                                    <div className="w-10 h-10 justify-center">
                                        <img
                                            src={imgPerfil}
                                            alt="Imagem de Perfil"
                                            className="rounded-full"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center p-1">
                                        <div className="text-xs">
                                            {ad.author.name.split(" ")[0]} {ad.author.name.split(" ").slice(-1)[0]}
                                        </div>
                                        <div className="text-xs">
                                            <FontAwesomeIcon icon={faStarHalfStroke} className="me-1 text-yellow-400"/>
                                            {formatScore(ad.author.score)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mx-8 col-start-2 col-end-2">
                                {ad.author.email != getEmail() &&
                                    <button className="bg-blue-500 px-4 py-1 rounded-xl text-white
                                                hover:bg-blue-800"
                                            onClick={handleCreateChat}
                                    >
                                        Contatar
                                    </button>
                                }
                            </div>
                        </div>
                        <div className="flex md:justify-end md:order-2 md:col-span-2">
                            <div className="flex items-center text-xs">
                                {ad.categories.map((category, index) => (
                                    <div key={index} onClick={() => handleCategoria(category.id)}>
                                    <span
                                        className="inline-block bg-blue-200 text-blue-800 px-3 py-1 me-1 rounded-full hover:cursor-pointer hover:bg-blue-400 hover:text-white">
                                        <FontAwesomeIcon icon={faTag}/> {category?.name}
                                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    Carregando...
                </div>
            )}
        </main>
    );
}

export default VisualizarAnuncio;