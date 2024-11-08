import {Ad} from "../../schema/AdSchema.tsx";
import {Link} from "react-router-dom";
import React from "react";

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

    return (
        <article className="flex flex-wrap gap-6 items-start p-6 mt-6 w-full bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px] max-md:px-5 max-md:max-w-full relative">

            <div className="flex flex-col flex-1 shrink basis-0 min-w-[160px] max-md:max-w-full">

                <div className="flex flex-col w-full max-md:max-w-full">

                    <h2 className="tracking-tight leading-tight text-xl font-semibold max-md:max-w-full">
                        {ad.title}
                    </h2>

                    <p className="mt-2 leading-snug text-gray-600 text-[length:var(--sds-typography-body-size-medium)] max-md:max-w-full">
                        {truncatedContent}
                    </p>

                    <div className="mt-1 flex justify-end w-full">
                        <Link to={`/ads/${ad.id}`} className="text-sm font-semibold text-blue-600 hover:underline">
                            Mais informações...
                        </Link>
                    </div>
                </div>

                <span className="absolute top-2 right-4 text-sm text-gray-500">
                    {formatDate(ad.date)}
                </span>

                <div
                    className="flex gap-4 items-center mt-4 w-full leading-none whitespace-nowrap font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-brand-on-brand)] text-[length:var(--sds-typography-body-size-medium)] max-md:max-w-full">
                    {ad.price > 0 && (
                        <span className="text-lg font-semibold text-gray-900 mb-2">
                            R${ad.price.toFixed(2)}
                        </span>
                    )}
                </div>

                <div className="absolute bottom-2 left-4 text-sm text-gray-500 flex gap-2">
                    {ad.categories.slice(0, 2).map((category, index) => (
                        <span key={index}>
                    {category.name}
                            {index < ad.categories.length - 1 && ', '}
                </span>
                    ))}
                    {ad.categories.length > 2 && <span>...</span>}
                </div>

                <div className="absolute bottom-2 right-4 text-sm text-gray-500">
                    <Link to={`/author/${ad.author.email}`} className="hover:underline">
                        {ad.author.name}
                    </Link>
                </div>

            </div>

            {ad.files.length > 0 && (
                <img
                    loading="lazy"
                    src=""
                    alt="Arquivo do anúncio"
                    className="object-contain m-3 shrink-0 w-40 aspect-square min-h-[160px] min-w-[160px]"
                />
            )}

        </article>

    );
};

export default AdCardsOptional;