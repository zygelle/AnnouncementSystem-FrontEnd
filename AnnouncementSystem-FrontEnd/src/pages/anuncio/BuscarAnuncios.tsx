import {Ad, FilterRequest, FilterRequestSchema, PaginatedAdsSchema} from "../../schema/AdSchema.tsx";
import {useEffect, useState} from "react";
import api from "../../services/api.tsx";
import FilterOffcanvas from "../../components/FilterOffcanvas.tsx";
import Pagination from "../../components/Pagination.tsx";
import AdCardsOptional from "../../components/cards/AdCards.tsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faBroom } from '@fortawesome/free-solid-svg-icons';

function BuscarAnuncios() {

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


    useEffect(() => {
        fetchAds();
    }, [page, filter]);

    const handleFilterChange = (newFilters: FilterRequest) => {
        setIsFilter(true)
        setFilter(newFilters);
    };

    const openOffcanvas = () => setIsOffcanvasOpen(true);
    const closeOffcanvas = () => setIsOffcanvasOpen(false);

    return (
        <main className='main-layout'>
            <div className="w-full max-w-3xl flex flex-col rounded-lg">
                <section className="flex items-center justify-between w-full lg:w-[287px] p-4 bg-white rounded-lg">
                    <h1 className="text-2xl font-semibold text-gray-900">Anúncios</h1>
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

                </section>

                <section className="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
                    {loading ? (
                        <p>Carregando...</p>
                    ) : (
                        ads.map((ad) => (
                            <AdCardsOptional key={ad.id} ad={ad}/>
                        ))
                    )}
                </section>

                <Pagination page={page} totalPages={totalPages} setPage={setPage}/>
            </div>

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

export default BuscarAnuncios;