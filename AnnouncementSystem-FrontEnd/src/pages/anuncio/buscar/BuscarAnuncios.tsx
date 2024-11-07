import {Ad, FilterRequest, FilterRequestSchema, PaginatedAdsSchema} from "../../../components/schema/AdSchema.tsx";
import {useEffect, useState} from "react";
import api from "../../../services/api.tsx";
import FilterOffcanvas from "../../../components/offcanvas/FilterOffcanvas.tsx";

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
    const [loading, setLoading] = useState(false);
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
        setFilter(newFilters);
    };

    const openOffcanvas = () => setIsOffcanvasOpen(true);
    const closeOffcanvas = () => setIsOffcanvasOpen(false);

    return (
        <div className={'main-layout'}>
            <main className={'main-content'}>
                <div className="w-full max-w-3xl flex flex-col p-8 rounded-lg bg-white shadow-2xl mt-8 mb-8">
                    <section className="flex flex-col max-w-full leading-tight w-[287px]">
                        <h1 className="text-xl font-medium">Anúncios</h1>
                        <p className="mt-2 text-gray-600">
                            Escolha uma opção bla bla bla
                        </p>
                        {/* Botão para abrir o offcanvas de filtro */}
                        <button onClick={openOffcanvas} className="btn-primary mt-4">
                            Filtrar
                        </button>
                    </section>

                    <section className="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
                        {loading ? (
                            <p>Carregando...</p>
                        ) : (
                            ads.map((ad) => (
                                <article key={ad.id} className="flex flex-wrap gap-6 items-start p-6 mt-6 w-full bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px] max-md:px-5 max-md:max-w-full">
                                    <img loading="lazy" src="" alt={ad.title} className="object-contain shrink-0 w-40 aspect-square min-h-[160px] min-w-[160px]" />
                                    <div className="flex flex-col flex-1 shrink basis-0 min-w-[160px] max-md:max-w-full">
                                        <div className="flex flex-col w-full max-md:max-w-full">
                                            <h2 className="tracking-tight leading-tight text-xl font-semibold max-md:max-w-full">{ad.title}</h2>
                                            <p className="mt-2 leading-snug text-gray-600 text-[length:var(--sds-typography-body-size-medium)] max-md:max-w-full">
                                                {ad.content}
                                            </p>
                                        </div>
                                        <div className="flex gap-4 items-center mt-4 w-full leading-none whitespace-nowrap font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-brand-on-brand)] text-[length:var(--sds-typography-body-size-medium)] max-md:max-w-full">
                                            <a href={`/ads/${ad.id}`} className="btn-primary">Ver Detalhes</a>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </section>

                    {/* Paginação */}
                    <div className="pagination mt-8 flex justify-center items-center space-x-4">
                        {page > 0 && <button onClick={() => setPage(page - 1)} className="btn-primary">&lt; Anterior</button>}
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button key={index} onClick={() => setPage(index)} className={`btn-primary ${index === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                {index + 1}
                            </button>
                        ))}
                        {page < totalPages - 1 && <button onClick={() => setPage(page + 1)} className="btn-primary">Próximo &gt;</button>}
                    </div>
                </div>
            </main>

            {isOffcanvasOpen && <FilterOffcanvas onApplyFilters={handleFilterChange} onClose={closeOffcanvas} />}
        </div>
    );
}

export default BuscarAnuncios;