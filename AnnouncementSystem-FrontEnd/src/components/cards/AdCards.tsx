import {Ad} from "../../schema/AdSchema.tsx";
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {setPathVisualizarAnuncio} from "../../routers/Paths.tsx";
import {getDownloadURL, listAll, ref} from "firebase/storage";
import {storage} from "../../services/firebaseConfig.tsx";

interface OptionAdCardsProps {
    ad: Ad;
}

const AdCardsOptional: React.FC<OptionAdCardsProps> = ({ ad }) => {

    const truncatedContent = ad.content.split('\n').slice(0, 4).join('\n');
    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        };
        return new Date(date).toLocaleDateString('pt-BR', options);
    };
    const [imageSrc, setImageSrc] = useState('/images/img-padrao.PNG');
    const [imageList, setImageList] = useState<string[]>([]);
    const naviagte = useNavigate()

    const fetchImages = (id: string) => {
        const imageListRef = ref(storage, `${id}/`)
        listAll(imageListRef).then((response) => {
            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setImageList((prevState) => [...prevState, url]);
                })
            })
        })
        if (imageList.length > 0) {
            const randomIndex = Math.floor(Math.random() * imageSrc.length);
            setImageSrc(imageSrc[randomIndex]);
        }
    }

    useEffect(() => {
        if (ad.imageArchive != null) fetchImages(ad.imageArchive);
    }, []);

    function handleNavigate(){
        naviagte(setPathVisualizarAnuncio(ad.id))
    }

    return (
        <div className="ad-card" onClick={handleNavigate}>
            <div className="ad-card-item first-line">
                <div className="ad-card-col text-sm">
                    {formatDate(ad.date)}
                </div>
                <div className="ad-card-col flex justify-end text-sm">
                    {ad.city.name}
                </div>
            </div>
            <div className="ad-card-item second-line">
                <div className="ad-card-col">
                    <div>
                        {truncatedContent}
                    </div>
                    <div>
                        {ad.price != null && ad.price > 0 && (
                            <p className="text-sm flex justify-end my-2">
                                Preço: R$ {ad.price.toFixed(2)}
                            </p>
                        )}
                    </div>
                </div>
                <div className="ad-card-col w-fit flex justify-center sm:justify-end">
                    <img
                        src={imageSrc}
                        alt={"Imagem do Anuncio"}
                        className="w-8/12"
                    />
                </div>
            </div>
            <div className="ad-card-item">
                <div className="ad-card-col text-md">
                    <span>
                        {ad.categories[0]?.name}
                        {ad.categories.length > 1 &&
                            <span>, ...</span>
                        }
                    </span>
                </div>
                <div className="ad-card-col flex justify-end text-sm">
                    <Link to={`/author/${ad.author.email}`} className="hover:underline">
                        {ad.author.name}
                    </Link>
                </div>
            </div>
        </div>

    );
};

export default AdCardsOptional;