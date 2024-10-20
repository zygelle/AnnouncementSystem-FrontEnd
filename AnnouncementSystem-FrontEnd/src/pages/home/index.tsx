import  Header  from '../../components/header';
import OptionCard from '../../components/cards';

const options = [
    {
      title: "Criar anúncio",
      description: "bla bla bla",
      buttonText: "Criar",
      buttonClass: "",
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/9aa627ecd38eaebe6f53832aa6aabcab9f9185dafaabc75d40d1baf8707973de?placeholderIfAbsent=true&apiKey=373b523e13e642948ff7f7e522970fd3"
    },
    {
      title: "Buscar anúncio",
      description: "bla bla bla",
      buttonText: "Buscar",
      buttonClass: "",
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/9aa627ecd38eaebe6f53832aa6aabcab9f9185dafaabc75d40d1baf8707973de?placeholderIfAbsent=true&apiKey=373b523e13e642948ff7f7e522970fd3"
    },
    {
      title: "Comunicação",
      description: "bla bla bla",
      buttonText: "Acessar",
      buttonClass: "",
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/9aa627ecd38eaebe6f53832aa6aabcab9f9185dafaabc75d40d1baf8707973de?placeholderIfAbsent=true&apiKey=373b523e13e642948ff7f7e522970fd3"
    },
    {
      title: "Perfil",
      description: "bla bla bla",
      buttonText: "Acessar",
      buttonClass: "",
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/9aa627ecd38eaebe6f53832aa6aabcab9f9185dafaabc75d40d1baf8707973de?placeholderIfAbsent=true&apiKey=373b523e13e642948ff7f7e522970fd3"
    }
  ];

export function Home() {
    return(
        <div className="flex flex-col bg-slate-100 items-center justify-center">
            
            <Header></Header>

            <main className="w-full max-w-3xl flex flex-col p-8 rounded-lg bg-white shadow-2x mb-20 ">
                <section className="flex flex-col max-w-full leading-tight w-[287px]">
                    <h1 className="tracking-tight font-[number:var(--sds-typography-heading-font-weight)] text-[color:var(--sds-color-text-default-default)] text-[length:var(--sds-typography-heading-size-base)]">
                        Bem-vindo ao Balcão UFF
                    </h1>
                    <p className="mt-2 font-[number:var(--sds-typography-subheading-font-weight)] text-[color:var(--sds-color-text-default-secondary)] text-[length:var(--sds-typography-subheading-size-medium)]">
                        Escolha uma opção bla bla bla
                    </p>
                </section>
                <section className="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
                    {options.map((option, index) => (
                    <OptionCard key={index} {...option} />
                    ))}
                </section>
            </main>
            
        </div>
    )
}
