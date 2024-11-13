import OptionCard from '../../components/cards/Cards.tsx';
import {pathCommunication, pathCreateAds, pathFilterAd, pathPerfil} from "../../routers/Paths.tsx";

const options = [
    {
        title: "Criar anúncio",
        description: "bla bla bla",
        buttonText: "Criar",
        path: pathCreateAds,
        imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/9aa627ecd38eaebe6f53832aa6aabcab9f9185dafaabc75d40d1baf8707973de?placeholderIfAbsent=true&apiKey=373b523e13e642948ff7f7e522970fd3"
    },
    {
        title: "Buscar anúncio",
        description: "bla bla bla",
        buttonText: "Buscar",
        path: pathFilterAd,
        imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/9aa627ecd38eaebe6f53832aa6aabcab9f9185dafaabc75d40d1baf8707973de?placeholderIfAbsent=true&apiKey=373b523e13e642948ff7f7e522970fd3"
    },
    {
        title: "Comunicação",
        description: "bla bla bla",
        buttonText: "Acessar",
        path: pathCommunication,
        imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/9aa627ecd38eaebe6f53832aa6aabcab9f9185dafaabc75d40d1baf8707973de?placeholderIfAbsent=true&apiKey=373b523e13e642948ff7f7e522970fd3"
    },
    {
        title: "Perfil",
        description: "bla bla bla",
        buttonText: "Acessar",
        path: pathPerfil,
        imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/9aa627ecd38eaebe6f53832aa6aabcab9f9185dafaabc75d40d1baf8707973de?placeholderIfAbsent=true&apiKey=373b523e13e642948ff7f7e522970fd3"
    }
];

export function Home() {
    return(
        <main>
            <section className="flex flex-col max-w-full leading-tight w-[287px]">
                <h1 className="text-xl font-medium">
                    Bem-vindo ao Balcão UFF
                </h1>
                <p className="mt-2 text-gray-600">
                    Escolha uma opção bla bla bla
                </p>
            </section>
            <section className="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
                {options.map((option, index) => (
                    <OptionCard key={index} {...option} />
                ))}
            </section>
        </main>
    )
}
