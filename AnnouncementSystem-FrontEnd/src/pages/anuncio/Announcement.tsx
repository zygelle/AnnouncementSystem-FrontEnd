import {Ad, FilterRequest} from "../../schema/AdSchema.tsx";
import React, {useEffect, useRef, useState} from "react";
import FilterOffcanvas from "../../components/FilterOffcanvas.tsx";
import Pagination from "../../components/Pagination.tsx";
import AdCardsOptional from "../../components/cards/AdCards.tsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faBroom } from '@fortawesome/free-solid-svg-icons';
import {useLocation} from "react-router-dom";
import {fetchAdsWithFilter} from "../../services/api/adsService.tsx";

interface AnnouncementProps {
    initialFilter?: FilterRequest;
}

const Announcement: React.FC<AnnouncementProps> = () => {

    const location = useLocation();
    const initialFilter = location.state as FilterRequest | undefined;

    const [ads, setAds] = useState<Ad[]>([]);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [filter, setFilter] = useState<FilterRequest>({
        title: "",
        content: "",
        cities: null,
        categories: null,
        minPrice: null,
        maxPrice: null,
        userType: null,
        ...initialFilter,
    });
    const [isFilter, setIsFilter] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false)
    const topRef = useRef<HTMLDivElement>(null);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleFilterChange = (newFilters: FilterRequest) => {
        setIsFilter(true)
        setFilter(newFilters);
    };

    const loadAds = async (filter: FilterRequest, page: number) => {
        setLoading(true);
        const result = await fetchAdsWithFilter(filter, page);
        if (result.success && result.data) {
            setAds(result.data.ads);
            setTotalPages(result.data.totalPages);
        } else {
            console.error(result.error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadAds(filter, page).catch((error) => {
            console.error("Erro ao carregar os anúncios:", error);
        });
    }, [page, filter]);


    useEffect(() => {
        if (initialFilter) {
            setIsFilter(true);
        }
    }, [initialFilter]);

    const openOffcanvas = () => setIsOffcanvasOpen(true);
    const closeOffcanvas = () => setIsOffcanvasOpen(false);

    return (
        <main>

            <div className="flex justify-between mb-4">
                <h1 ref={topRef} className="text-3xl font-semibold text-gray-900">Anúncios</h1>
                <div className="flex gap-2">
                    <button
                        onClick={openOffcanvas}
                        className="text-gray-600 hover:text-blue-600 transition duration-200"
                        aria-label="Abrir Filtro"
                    >
                        <FontAwesomeIcon icon={faFilter} className="w-6 h-6"/>
                    </button>
                    {isFilter && (
                        <button
                            onClick={() => {
                                setFilter({
                                    title: "",
                                    content: "",
                                    cities: null,
                                    categories: null,
                                    minPrice: null,
                                    maxPrice: null,
                                    userType: null,
                                });
                                setIsFilter(false);
                            }}
                            className="text-gray-600 hover:text-red-600 transition duration-200"
                            aria-label="Limpar Filtro"
                        >
                            <FontAwesomeIcon icon={faBroom} className="w-6 h-6"/>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <div className="border-4 border-t-4 border-gray-200 border-solid w-16 h-16 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    ads.length > 0 ? (
                        ads.map((ad) => (
                            <AdCardsOptional key={ad.id} ad={ad} />
                        ))
                    ) : (
                        <div className="flex justify-center items-center mt-24">
                            <p className="text-gray-500 text-lg">Nenhum anúncio encontrado!</p>
                        </div>
                    )
                )}
            </div>

            {totalPages > 1 &&
                <Pagination page={page} totalPages={totalPages} setPage={handlePageChange}/>
            }

            {isOffcanvasOpen && (
                <FilterOffcanvas
                    isOpen={isOffcanvasOpen}
                    onApplyFilters={handleFilterChange}
                    onClose={closeOffcanvas}
                    currentFilters={filter}
                />
            )}

        </main>
    );
}

export default Announcement;