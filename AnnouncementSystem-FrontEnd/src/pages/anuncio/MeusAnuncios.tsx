import {Ad} from "../../schema/AdSchema.tsx";
import {useEffect, useState} from "react";
import api from "../../services/api.tsx";
import AdCardsOptional from "../../components/cards/AdCards.tsx";

const MeusAnuncios: React.FC = () => {
    const [openAds, setOpenAds] = useState<Ad[]>([]);
    const [closedAds, setClosedAds] = useState<Ad[]>([]);
    const [suspendedAds, setSuspendedAds] = useState<Ad[]>([]);
    const [currentTab, setCurrentTab] = useState("open");
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAds = async (status: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.get(`/announcement/${status}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const ads = response.data.content || []; 
    
            if (status === "open") {
                setOpenAds(ads);
            } else if (status === "closed") {
                setClosedAds(ads);
            } else if (status === "suspended") {
                setSuspendedAds(ads);
            }
        } catch (error) {
            console.error(`Erro ao buscar anúncios ${status}:`, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds(currentTab);
    }, [currentTab]);

    return (
        <main>
            <h1 className="text-3xl font-semibold text-gray-900">Meus Anúncios</h1>
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px">
                    <li className="me-2">
                        <button
                            className={`inline-block p-4 ${
                                currentTab === "open"
                                    ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                                    : "border-transparent hover:text-gray-600 hover:border-gray-300"
                            }`}
                            onClick={() => setCurrentTab("open")}
                        >
                            Ativos <span>({openAds.length})</span>
                        </button>
                    </li>
                    <li className="me-2">
                        <button
                            className={`inline-block p-4 ${
                                currentTab === "closed"
                                    ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                                    : "border-transparent hover:text-gray-600 hover:border-gray-300"
                            }`}
                            onClick={() => setCurrentTab("closed")}
                        >
                            Finalizados <span>({closedAds.length})</span>
                        </button>
                    </li>
                    <li className="me-2">
                        <button
                            className={`inline-block p-4 ${
                                currentTab === "suspended"
                                    ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                                    : "border-transparent hover:text-gray-600 hover:border-gray-300"
                            }`}
                            onClick={() => setCurrentTab("suspended")}
                        >
                            Suspensos <span>({suspendedAds.length})</span>
                        </button>
                    </li>
                </ul>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
                {currentTab === "open" &&
                    (openAds.length > 0 ? (
                        openAds.map((ad) => <AdCardsOptional key={ad.id} ad={ad} />)
                    ) : (
                        !loading && (
                            <div className="flex justify-center items-center mt-24">
                                <p className="text-gray-500 text-lg">Nenhum anúncio encontrado.</p>
                            </div>
                        )
                    ))}

                {currentTab === "closed" &&
                    (closedAds.length > 0 ? (
                        closedAds.map((ad) => <AdCardsOptional key={ad.id} ad={ad} />)
                    ) : (
                        !loading && (
                            <div className="flex justify-center items-center mt-24">
                                <p className="text-gray-500 text-lg">Nenhum anúncio finalizado encontrado.</p>
                            </div>
                        )
                    ))}

                {currentTab === "suspended" &&
                    (suspendedAds.length > 0 ? (
                        suspendedAds.map((ad) => <AdCardsOptional key={ad.id} ad={ad} />)
                    ) : (
                        !loading && (
                            <div className="flex justify-center items-center mt-24">
                                <p className="text-gray-500 text-lg">Nenhum anúncio suspenso encontrado.</p>
                            </div>
                        )
                    ))}
            </div>
        </main>
    );
}

export default MeusAnuncios;