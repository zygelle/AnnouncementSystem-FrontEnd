import {Ad} from "../../schema/AdSchema.tsx";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {setPathVisualizarAnuncio} from "../../routers/Paths.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTag} from "@fortawesome/free-solid-svg-icons";
import {formatDateSimple} from "../../utils/formatDateSimple.tsx";
import {fetchFirstImage} from "../../services/firebase/fetchFirstImage.tsx";

interface OptionSmallAdCardProps {
    ad: Ad;
}

const SmallAdCard: React.FC<OptionSmallAdCardProps> = ({ ad }) => {

    const [image, setImage] = useState('/images/img-padrao.PNG');
    const navigate = useNavigate();

    useEffect(() => {
        const getImage = async () => {
            const url = await fetchFirstImage(ad.imageArchive);
            if (url) {
                setImage(url);
            }
        };

        getImage().catch((error) => {
            console.error("Erro ao buscar imagem do anúncio: " + error)
        });
    }, [ad.imageArchive]);

    function handleNavigate(){
        navigate(setPathVisualizarAnuncio(ad.id))
    }

    return (
        <div className="min-w-72 max-w-72 grid grid-cols-1 gap-2 place-content-center border-solid border-2 p-4 border-gray-300 rounded-3xl
                       hover:border-blue-500 hover:cursor-pointer hover:shadow-blue-100 hover:shadow-md
        " onClick={handleNavigate}>
            <div className="grid grid-cols-2 col-span-2">
                <div className="text-xs">{ad.city.name}</div>
                <div className="text-end text-xs">{formatDateSimple(ad.date)}</div>
            </div>
            <div className="justify-items-center content-center">
                <div className="flex justify-center items-center overflow-hidden h-40">
                    <img
                        src={image}
                        alt="Imagem do Anúncio"
                        className="w-screen"
                    />
                </div>
            </div>
            <div className="text-md col-span-2 font-semibold line-clamp-1">{ad.title}</div>
            <div className="grid grid-cols-1 gap-1 col-span-2">
                <div className="line-clamp-2">{ad.content}</div>
                <div className="text-sm font-medium">{
                    ad.price != null && ad.price > 0 &&
                    (<span>R$ {ad.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>)
                }</div>
            </div>
            <div className="grid grid-cols-1 col-span-2">
                <div className="text-start text-xs hover:cursor-pointer">
                    {ad.categories && ad.categories.length > 1 ? (
                        <div className="relative group">
                            <span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
                                <FontAwesomeIcon icon={faTag} /> {ad.categories[0].name}
                            </span>
                            <span className="ml-2 font-bold">...</span>
                            <div
                                className="text-center absolute hidden group-hover:block bg-white border
                                border-gray-200 shadow-lg mt-1 rounded-lg p-2 w-fit">
                                <ul>
                                    {ad.categories.slice(1).map((category, index) => (
                                        <div key={index} className="py-1">
                                            <span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
                                              <FontAwesomeIcon icon={faTag} /> {category?.name}
                                            </span>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
                            <FontAwesomeIcon icon={faTag} /> {ad.categories?.[0]?.name}
                        </span>
                    )}
                </div>
            </div>
        </div>

    );
};

export default SmallAdCard;