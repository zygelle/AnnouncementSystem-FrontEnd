import {getEmail} from "../../services/token.tsx";
import {useLocation} from "react-router-dom";
import {userSchema, User} from "../../schema/UserSchema.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faStarHalfStroke} from "@fortawesome/free-solid-svg-icons";
import {Ad, PaginatedAdsSchema} from "../../schema/AdSchema.tsx";
import SmallAdCard from "../../components/cards/SmallAdCards.tsx";
import {useCallback, useEffect, useState} from 'react';
import {Assessment, PaginatedAssessmentsSchema} from "../../schema/AssessmentSchema.tsx";
import SmallAssessmentCard from "../../components/cards/SmallAssessmentCard.tsx";
import {formatScore} from "../../utils/formatScore.tsx";
import {fetchImgPerfil} from "../../services/firebase/fetchImgPerfil.tsx";
import api from "../../services/api/api.tsx";

function Perfil() {
    const location = useLocation();
    const email = location.state?.advertiserEmail || getEmail();
    const [user, setUser] = useState<User | null>(null);
    const [imgPerfil, setImgPerfil] = useState<string>('/images/img-padrao.PNG');

    const [ads, setAds] = useState<Ad[]>([]);
    const [pageAd, setPageAd] = useState<number>(0);
    const [totalPagesAd, setTotalPagesAd] = useState<number>(0);

    const [favorites, setFavorites] = useState<Ad[]>([])
    const [pageFav, setPageFav] = useState<number>(0)
    const [totalPagesFav, setTotalPagesFav] = useState<number>(0)

    const [reviews, setReviews] = useState<Assessment[]>([])
    const [pageReviews, setPageReviews] = useState<number>(0)
    const [totalPagesReviews, setTotalPagesReviews] = useState<number>(0)

    const [assessments, setAssessments] = useState<Assessment[]>([])
    const [pageAssessments, setPageAssessments] = useState<number>(0)
    const [totalPagesAssessments, setTotalPagesAssessments] = useState<number>(0)

    const fetchUser = useCallback(async () => {
        try {
            setUser(null)
            const response = await api.get(`/user/${email}`);
            const validate = userSchema.safeParse(response.data);
            if (validate.success) {
                setUser(validate.data);
                fetchImgPerfil(validate.data.icon, setImgPerfil);
            } else {
                console.log("Erro ao validar usuário: " + validate.error);
            }
        } catch (error) {
            console.error("Erro ao buscar usuário: " + error);
        }
    }, [email]);

    const fetchAds = useCallback(async () => {
        if(pageAd === 0) setAds([])
        try {
            const response = await api.get(`/announcement/user/${email}?page=${pageAd}&size=3`);
            const parsed = PaginatedAdsSchema.safeParse(response.data);
            if (parsed.success) {
                setAds((prevAds) => [...prevAds, ...parsed.data.content]);
                setTotalPagesAd(parsed.data.totalPages);
            } else {
                console.error("Erro ao validar anúncios:", parsed.error);
            }
        } catch (error) {
            console.error("Erro ao buscar anúncios:", error);
        }
    }, [email, pageAd]);

    const fetchAssessments = useCallback(async () => {
        if(pageAssessments === 0) setAssessments([])
        try {
            const response = await api.get(`/assessment/${email}/?page=${pageAssessments}&size=3`);
            const parsed = PaginatedAssessmentsSchema.safeParse(response.data);
            if (parsed.success) {
                setAssessments((prevAss) => [...prevAss, ...parsed.data.content]);
                setTotalPagesAssessments(parsed.data.totalPages);
            } else {
                console.error("Erro ao validar avaliações:", parsed.error);
            }
        } catch (error) {
            console.error("Erro ao buscar avaliações:", error);
        }
    }, [email, pageAssessments]);

    const fetchFavorites = useCallback(async () => {
        if(pageFav === 0) setFavorites([])
        try {
            const response = await api.get(`/favorite?page=${pageFav}&size=3`);
            const parsed = PaginatedAdsSchema.safeParse(response.data);
            if (parsed.success) {
                setFavorites((prevFav) => [...prevFav, ...parsed.data.content]);
                setTotalPagesFav(parsed.data.totalPages);
            } else {
                console.error("Erro ao validar favoritos:", parsed.error);
            }
        } catch (error) {
            console.error("Erro ao buscar favoritos:", error);
        }
    }, [pageFav]);

    const fetchReviews = useCallback(async () => {
        if(pageReviews === 0) setReviews([])
        try {
            const response = await api.get(`/assessment/reviews?page=${pageReviews}&size=3`);
            const parsed = PaginatedAssessmentsSchema.safeParse(response.data);
            if (parsed.success) {
                setReviews((prevAds) => [...prevAds, ...parsed.data.content]);
                setTotalPagesReviews(parsed.data.totalPages);
            } else {
                console.error("Erro de validação", parsed.error);
            }
        } catch (error) {
            console.error("Erro ao buscar os anúncios do usuário: " + error);
        }
    },[pageReviews]);

    useEffect(() => {
        fetchUser().catch((error) => {
            console.error("Error ao buscar usuário: " + error)
        })
    }, [email, fetchUser]);

    useEffect(() => {
        if(pageAd === 0){
            setAds([])
            fetchAds().catch((error) => {
                console.error("Error ao buscar anúncios: " + error)
            })
        }else
            fetchAds().catch((error) => {
                console.error("Error ao buscar anúncios: " + error)
            })
    }, [pageAd, fetchAds]);

    useEffect(() => {
        if(email === getEmail())
            fetchFavorites().catch((error) => {
                console.error("Error ao buscar favoritos: " + error)
            })
    }, [email, pageFav, fetchFavorites]);

    useEffect(() => {
        if(email === getEmail())
            fetchReviews().catch((error) => {
                console.error("Error ao buscar avaliações que o usuário fez: " + error)
            })
    }, [email, pageReviews, fetchReviews]);

    useEffect(() => {
        fetchAssessments().catch((error) => {
            console.error("Error ao buscar avaliações: " + error)
        })
    }, [pageAssessments, fetchAssessments]);

    const loadMoreAds = () => setPageAd((prevPage) => {
        if(prevPage + 1 > totalPagesAd) {
            setAds([])
            return 0;
        }
        else return prevPage + 1
    });

    const loadMoreFavorites = () => setPageFav((prevPage) => {
        if(prevPage + 1 > totalPagesFav) {
            setFavorites([])
            return 0;
        }
        else return prevPage + 1
    });

    const loadMoreReviews = () => setPageReviews((prevPage) => {
        if(prevPage + 1 > totalPagesReviews) {
            setReviews([])
            return 0;
        }
        else return prevPage + 1
    });

    const loadMoreAssessments = () => setPageAssessments((prevPage) => {
        if(prevPage + 1 > totalPagesAssessments) {
            setAssessments([])
            return 0;
        }
        else return prevPage + 1
    });

    return (
        <main>
            {user ? (
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-3">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-center align-middle mb-4">
                            <div className="w-56 h-56 justify-center">
                                <img
                                    src={imgPerfil}
                                    alt="Imagem de Perfil"
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                        <div className="font-bold text-xl text-center">{user.name}</div>
                        <div className="text-gray-600 text-center text-md">{user.type}</div>
                        <div className="text-lg text-center mt-2">
                            <FontAwesomeIcon icon={faStarHalfStroke} className="me-1 text-yellow-400" />
                            {formatScore(user.score)}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 max-w-full min-w-full">
                        <div className="flex flex-col gap-1">
                            <div className="text-lg font-semibold">Meus Anúncios</div>
                            <div className="flex gap-2 overflow-y-auto pb-2"
                            >
                                {ads.length > 0 ? (
                                    <>
                                        {ads.map((ad) => (
                                            <SmallAdCard ad={ad} key={ad.id}/>
                                        ))}
                                        {pageAd + 1 < totalPagesAd && (
                                            <div className="flex h-full items-center mx-3 py-2">
                                                <div onClick={loadMoreAds} >
                                                    <FontAwesomeIcon className="bg-blue-950 p-2 rounded-full text-white" icon={faArrowRight} size="2xl" />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center w-full italic text-gray-700">Nenhum Anúncio</div>
                                )}
                            </div>
                        </div>
                        {user.email === getEmail() && (
                            <div className="flex flex-col gap-1">
                                <div className="text-lg font-semibold">Meus Favoritos</div>
                                <div className="flex gap-2 overflow-y-auto pb-2"
                                >
                                    {favorites.length > 0 ? (
                                        <>
                                            {favorites.map((favorite) => (
                                                <SmallAdCard ad={favorite} key={favorite.id}/>
                                            ))}
                                            {pageFav + 1 < totalPagesFav && (
                                                <div className="flex h-full items-center mx-3 py-2">
                                                    <div onClick={loadMoreFavorites} >
                                                        <FontAwesomeIcon className="bg-blue-950 p-2 rounded-full text-white"
                                                                     icon={faArrowRight} size="2xl"/>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center w-full italic text-gray-700">Lista de Favorito
                                            Vazia</div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <div className="text-lg font-semibold">Avaliações Recebidas</div>
                            <div className="flex gap-2 overflow-y-auto pb-2"
                            >
                                {assessments.length > 0 ? (
                                    <>
                                        {assessments.map((assessment) => (
                                            <SmallAssessmentCard assessment={assessment} key={assessment.id}/>
                                        ))}
                                        {pageAssessments + 1 < totalPagesAssessments && (
                                            <div className="flex h-full items-center mx-3 py-2">
                                                <div onClick={loadMoreAssessments}>
                                                    <FontAwesomeIcon className="bg-blue-950 p-2 rounded-full text-white"
                                                                     icon={faArrowRight} size="2xl"/>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center w-full italic text-gray-700">Nenhuma Avaliação</div>
                                )}
                            </div>
                        </div>
                        {user.email === getEmail() && (
                            <div className="flex flex-col gap-1">
                                <div className="text-lg font-semibold">Minhas Avaliações</div>
                                <div className="flex gap-2 overflow-y-auto pb-2"
                                >
                                    {reviews.length > 0 ? (
                                        <>
                                            {reviews.map((review) => (
                                                <SmallAssessmentCard assessment={review} key={review.id}/>
                                            ))}
                                            {pageReviews + 1 < totalPagesReviews && (
                                                <div className="flex h-full items-center mx-3 py-2">
                                                    <div onClick={loadMoreReviews}>
                                                        <FontAwesomeIcon
                                                            className="bg-blue-950 p-2 rounded-full text-white"
                                                            icon={faArrowRight} size="2xl"/>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center w-full italic text-gray-700">Nenhuma Avaliação
                                            Feita</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="w-full h-full flex text-center items-center">Carregando...</div>
            )}
        </main>
    );
}

export default Perfil;

