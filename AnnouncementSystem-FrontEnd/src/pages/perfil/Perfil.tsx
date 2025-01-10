import {getEmail} from "../../services/token.tsx";
import {useLocation} from "react-router-dom";
import api from "../../services/api.tsx";
import {userSchema, User} from "../../schema/UserSchema.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStarHalfStroke} from "@fortawesome/free-solid-svg-icons";
import {Ad, PaginatedAdsSchema} from "../../schema/AdSchema.tsx";
import SmallAdCard from "../../components/cards/SmallAdCards.tsx";
import {useCallback, useEffect, useRef, useState} from 'react';
import {AssessmentSchema, PaginatedAssessmentsSchema} from "../../schema/AssessmentSchema.tsx";
import SmallAssessmentCard from "../../components/cards/SmallAssessmentCard.tsx";
import {formatScore} from "../../utils/formatScore.tsx";
import {fetchImgPerfil} from "../../utils/fetchImgPerfil.tsx";

function Perfil() {
    const location = useLocation();
    const email = location.state?.advertiserEmail || getEmail();
    const [user, setUser] = useState<User | undefined>();
    const [imgPerfil, setImgPerfil] = useState<string>('/images/img-padrao.PNG');

    const fetchUser = async () => {
        try {
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
    };

    const [ads, setAds] = useState<Ad[]>([]);
    const [pageAd, setPageAd] = useState<number>(0);
    const [totalPagesAd, setTotalPagesAd] = useState<number>(0);

    const adsContainerRefAd = useRef<HTMLDivElement | null>(null);
    const observerRefAd = useRef<IntersectionObserver | null>(null);

    const loadMoreAds = useCallback(() => {
        if (pageAd + 1 < totalPagesAd) {
            setPageAd((prevPage) => prevPage + 1);
        }
    }, [pageAd, totalPagesAd]);

    useEffect(() => {
        const observerCallback: IntersectionObserverCallback = (entries) => {
            if (entries[0].isIntersecting) {
                loadMoreAds();
            }
        };

        if (adsContainerRefAd.current) {
            observerRefAd.current = new IntersectionObserver(observerCallback, {
                root: adsContainerRefAd.current,
                rootMargin: "0px",
                threshold: 1.0,
            });

            const sentinel = document.getElementById("ads-sentinel");
            if (sentinel) observerRefAd.current.observe(sentinel);
        }

        return () => observerRefAd.current?.disconnect();
    }, [loadMoreAds]);

    const fetchMyAds = async (email: string) => {
        try {
            if(pageAd == 0 || pageAd > totalPagesAd){
                setAds([])
                setPageAd(0)
                setTotalPagesAd(0)
            }
            const response = await api.get(`/announcement/user/${email}?page=${pageAd}&size=3`);
            const parsed = PaginatedAdsSchema.safeParse(response.data);
            if (parsed.success) {
                setAds((prevAds) => [...prevAds, ...parsed.data.content]);
                setTotalPagesAd(parsed.data.totalPages);
            } else {
                console.error("Erro de validação", parsed.error);
            }
        } catch (error) {
            console.error("Erro ao buscar os anúncios do usuário: " + error);
        }
    };

    const [favorites, setFavorites] = useState<Ad[]>([])
    const [pageFav, setPageFav] = useState<number>(0)
    const [totalPagesFav, setTotalPagesFav] = useState<number>(0)

    const adsContainerRefFav = useRef<HTMLDivElement | null>(null);
    const observerRefFav = useRef<IntersectionObserver | null>(null);

    const loadMoreFav = useCallback(() => {
        if (pageFav + 1 < totalPagesFav) {
            setPageFav((prevPage) => prevPage + 1);
        }
    }, [pageFav, totalPagesFav]);

    useEffect(() => {
        const observerCallback: IntersectionObserverCallback = (entries) => {
            if (entries[0].isIntersecting) {
                loadMoreFav();
            }
        };

        if (adsContainerRefFav.current) {
            observerRefFav.current = new IntersectionObserver(observerCallback, {
                root: adsContainerRefFav.current,
                rootMargin: "0px",
                threshold: 1.0,
            });

            const sentinel = document.getElementById("fav-sentinel");
            if (sentinel) observerRefFav.current.observe(sentinel);
        }

        return () => observerRefFav.current?.disconnect();
    }, [loadMoreFav]);

    const fetchMyFavorites = async () => {
        try {
            if(pageFav == 0 || pageFav > totalPagesFav){
                setFavorites([])
                setPageFav(0)
                setTotalPagesFav(0)
            }
            const response = await api.get(`/favorite?page=${pageFav}&size=3`);
            const parsed = PaginatedAdsSchema.safeParse(response.data);
            if (parsed.success) {
                setFavorites((prevAds) => [...prevAds, ...parsed.data.content]);
                setTotalPagesFav(parsed.data.totalPages);
            } else {
                console.error("Erro de validação", parsed.error);
            }
        } catch (error) {
            console.error("Erro ao buscar os anúncios do usuário: " + error);
        }
    };

    const [myReviews, setMyReviews] = useState<AssessmentSchema[]>([])
    const [pageReviews, setPageReviews] = useState<number>(0)
    const [totalPagesReviews, setTotalPagesReviews] = useState<number>(0)

    const adsContainerRefReviews = useRef<HTMLDivElement | null>(null);
    const observerRefReviews = useRef<IntersectionObserver | null>(null);

    const loadMoreReviews = useCallback(() => {
        if (pageReviews + 1 < totalPagesReviews) {
            setPageReviews((prevPage) => prevPage + 1);
        }
    }, [pageReviews, totalPagesReviews]);

    useEffect(() => {
        const observerCallback: IntersectionObserverCallback = (entries) => {
            if (entries[0].isIntersecting) {
                loadMoreReviews();
            }
        };

        if (adsContainerRefReviews.current) {
            observerRefReviews.current = new IntersectionObserver(observerCallback, {
                root: adsContainerRefReviews.current,
                rootMargin: "0px",
                threshold: 1.0,
            });

            const sentinel = document.getElementById("rev-sentinel");
            if (sentinel) observerRefReviews.current.observe(sentinel);
        }

        return () => observerRefReviews.current?.disconnect();
    }, [loadMoreReviews]);

    const fetchMyReviews = async () => {
        try {
            if(pageReviews == 0 || pageReviews > totalPagesReviews){
                setMyReviews([])
                setPageReviews(0)
                setTotalPagesReviews(0)
            }
            const response = await api.get(`/assessment/reviews?page=${pageReviews}&size=3`);
            const parsed = PaginatedAssessmentsSchema.safeParse(response.data);
            if (parsed.success) {
                setMyReviews((prevAds) => [...prevAds, ...parsed.data.content]);
                setTotalPagesReviews(parsed.data.totalPages);
            } else {
                console.error("Erro de validação", parsed.error);
            }
        } catch (error) {
            console.error("Erro ao buscar os anúncios do usuário: " + error);
        }
    };

    const [assessments, setAssessments] = useState<AssessmentSchema[]>([])
    const [pageAssessments, setPageAssessments] = useState<number>(0)
    const [totalPagesAssessments, setTotalPagesAssessments] = useState<number>(0)

    const adsContainerRefAss = useRef<HTMLDivElement | null>(null);
    const observerRefAss = useRef<IntersectionObserver | null>(null);

    const loadMoreAss = useCallback(() => {
        if (pageAssessments + 1 < totalPagesAssessments) {
            setPageAssessments((prevPage) => prevPage + 1);
        }
    }, [pageAssessments, totalPagesAssessments]);

    useEffect(() => {
        const observerCallback: IntersectionObserverCallback = (entries) => {
            if (entries[0].isIntersecting) {
                loadMoreAss();
            }
        };

        if (adsContainerRefAss.current) {
            observerRefAss.current = new IntersectionObserver(observerCallback, {
                root: adsContainerRefAss.current,
                rootMargin: "0px",
                threshold: 1.0,
            });

            const sentinel = document.getElementById("ass-sentinel");
            if (sentinel) observerRefAss.current.observe(sentinel);
        }

        return () => observerRefAss.current?.disconnect();
    }, [loadMoreAss]);

    const fetchMyAssessment = async () => {
        try {
            if(pageAssessments == 0 || pageAssessments > totalPagesAssessments){
                setAssessments([])
                setPageAssessments(0)
                setTotalPagesAssessments(0)
            }
            const response = await api.get(`/assessment/assessments/${email}?page=${pageAssessments}&size=3`);
            const parsed = PaginatedAssessmentsSchema.safeParse(response.data);
            if (parsed.success) {
                setAssessments((prevAds) => [...prevAds, ...parsed.data.content]);
                setTotalPagesAssessments(parsed.data.totalPages);
            } else {
                console.error("Erro de validação", parsed.error);
            }
        } catch (error) {
            console.error("Erro ao buscar os anúncios do usuário: " + error);
        }
    };

    useEffect(() => {
        fetchUser()
    }, [email]);

    useEffect(() => {
        fetchMyAds(email);
    }, [pageAd]);

    useEffect(() => {
        fetchMyFavorites()
    }, [pageFav]);

    useEffect(() => {
        fetchMyReviews()
    }, [pageReviews]);

    useEffect(() => {
        fetchMyAssessment()
    }, [pageAssessments]);

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
                            <div className="text-lg font-semibold">Anúncios</div>
                            <div className="flex gap-2 overflow-y-auto pb-2"
                                 ref={adsContainerRefAd}

                            >
                                {ads.length > 0 ? (
                                    <>
                                        {ads.map((ad) => (
                                            <SmallAdCard ad={ad} key={ad.id}/>
                                        ))}
                                        <div id="ads-sentinel" className="h-2 w-full"></div>
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
                                     ref={adsContainerRefFav}
                                >
                                    {favorites.length > 0 ? (
                                        <>
                                            {favorites.map((ad) => (
                                                <SmallAdCard ad={ad} key={ad.id}/>
                                            ))}
                                            <div id="fav-sentinel" className="h-2 w-full"></div>
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
                                 ref={adsContainerRefAss}
                            >
                                {assessments.length > 0 ? (
                                    <>
                                        {assessments.map((assessment) => (
                                            <SmallAssessmentCard assessment={assessment} key={assessment.id}/>
                                        ))}
                                        <div id="ass-sentinel" className="h-2 w-full"></div>
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
                                     ref={adsContainerRefReviews}
                                >
                                    {myReviews.length > 0 ? (
                                        <>
                                            {myReviews.map((review) => (
                                                <SmallAssessmentCard assessment={review} key={review.id}/>
                                            ))}
                                            <div id="rev-sentinel" className="h-2 w-full"></div>
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
                <div>Nenhum usuário</div>
            )}
        </main>
    );
}

export default Perfil;

