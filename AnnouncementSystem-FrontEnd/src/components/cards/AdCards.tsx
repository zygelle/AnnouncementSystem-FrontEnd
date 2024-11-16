import {Ad} from "../../schema/AdSchema.tsx";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {setPathVisualizarAnuncio} from "../../routers/Paths.tsx";
import {getDownloadURL, listAll, ref} from "firebase/storage";
import {storage} from "../../services/firebaseConfig.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTag} from "@fortawesome/free-solid-svg-icons";

interface OptionAdCardsProps {
    ad: Ad;
}

const AdCardsOptional: React.FC<OptionAdCardsProps> = ({ ad }) => {

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        };
        return new Date(date).toLocaleDateString('pt-BR', options);
    };
    const [imageSrc, setImageSrc] = useState('/images/img-padrao.PNG');
    const naviagte = useNavigate();

    useEffect(() => {
        fetchImages(ad.imageArchive)
    }, []);

    const fetchImages = (id: string | null | undefined) => {
        if (!ad.imageArchive) {
            return;
        }
        const imageListRef = ref(storage, `${id}/`);
        listAll(imageListRef).then((response) => {
            if (response.items.length > 0) {
                getDownloadURL(response.items[0]).then((url) => {
                    setImageSrc(url);
                });
            } else {
                console.log("Nenhuma imagem encontrada.");
            }
        }).catch(error => {
            console.error("Erro ao buscar as imagens:", error);
        });
    };

    function handleNavigate(){
        naviagte(setPathVisualizarAnuncio(ad.id))
    }

    return (
        <div className="w-full grid grid-cols-1 gap-2 place-content-center border-solid border-2 p-4 border-gray-300 rounded-3xl
                        md:grid-cols-3
        " onClick={handleNavigate}>
            <div className="grid grid-cols-2 col-span-2 md:order-2">
                <div>{ad.city.name}</div>
                <div className="text-end text-sm">{formatDate(ad.date)}</div>
            </div>
            <div className="justify-items-center content-center md:row-span-5 md:order-1">
                <div className="flex justify-center items-center overflow-hidden h-40 md:h-48 md:rounded-3xl lg:40">
                    <img
                        src={imageSrc}
                        alt="Imagem do Anúncio"
                        className="w-screen"
                    />
                </div>
            </div>
            <div className="text-xl hover:text-blue-400 col-span-2 md:order-2">{ad.title}</div>
            <div className="grid grid-cols-1 gap-1 col-span-2 md:order-2">
                <div className="line-clamp-2 md:line-clamp-3">{ad.content}</div>
                <div className="text-sm font-medium">{
                    ad.price != null && ad.price > 0 &&
                    (<span>R$ {ad.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>)
                }</div>
            </div>
            <div className="grid grid-cols-2 col-span-2 md:order-2">
                <div className="text-start text-xs hover:cursor-pointer">
                    {ad.categories && ad.categories.length > 1 ? (
                        <div className="relative group">
                            <span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
                                <FontAwesomeIcon icon={faTag} /> {ad.categories[0].name}
                            </span>
                            <span className="ml-2 font-bold">...</span>
                            <div
                                className="text-center absolute hidden group-hover:block bg-white border border-gray-200 shadow-lg mt-1 rounded-lg p-2 w-fit">
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
                <div className="text-end">
                    {ad.author.name.split(" ")[0]} {ad.author.name.split(" ").slice(-1)[0]}
                </div>
            </div>
        </div>

    );
};

export default AdCardsOptional;