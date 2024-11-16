import {Ad, FilterRequest, FilterRequestSchema, PaginatedAdsSchema} from "../../schema/AdSchema.tsx";
import {useEffect, useState} from "react";
import api from "../../services/api.tsx";
import FilterOffcanvas from "../../components/FilterOffcanvas.tsx";
import Pagination from "../../components/Pagination.tsx";
import AdCardsOptional from "../../components/cards/AdCards.tsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faBroom } from '@fortawesome/free-solid-svg-icons';

interface AnunciosProps {
    initialFilter?: FilterRequest;
}

const Anuncios: React.FC<AnunciosProps> = ({ initialFilter }) => {

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
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const validation = FilterRequestSchema.safeParse(filter);
            if (!validation.success) {
                console.error("Erro de validação dos dados de requisição", validation.error);
                return;
            }
            const response = await api.post(`announcement/filter?page=${page}&size=10`, validation.data);
            const parsed = PaginatedAdsSchema.safeParse(response.data);
            if (parsed.success) {
                setAds(parsed.data.content);
                setTotalPages(parsed.data.totalPages);
            } else {
                console.error("Erro de validação", parsed.error);
            }
        } catch (error) {
            console.error("Erro ao buscar os anúncios", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters: FilterRequest) => {
        setIsFilter(true)
        setFilter(newFilters);
    };

    useEffect(() => {
        fetchAds()
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
                <h1 className="text-3xl font-semibold text-gray-900">Anúncios</h1>
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
                                setIsFilter(false); // Define `isFilter` para falso após a limpeza
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
                <Pagination page={page} totalPages={totalPages} setPage={setPage}/>
            }

            {isOffcanvasOpen && (
                <FilterOffcanvas
                    isOpen={isOffcanvasOpen}
                    onApplyFilters={handleFilterChange}
                    onClose={closeOffcanvas}
                />
            )}

        </main>
    );
}

export default Anuncios;