import React from 'react';
import {useNavigate} from "react-router-dom";

interface OptionCardProps {
  title: string;
  description: string;
  buttonText: string;
  path: string;
}

const OptionCard: React.FC<OptionCardProps> = ({ title, description, buttonText, path }) => {

  const navigate = useNavigate();

  function handleNavigate () {
    navigate(path)
  }

  return (
    <article className="flex flex-wrap gap-6 items-start p-6 mt-6 w-full bg-white rounded-lg border border-solid border-zinc-300 min-w-[240px] max-md:px-5 max-md:max-w-full">
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/9aa627ecd38eaebe6f53832aa6aabcab9f9185dafaabc75d40d1baf8707973de?placeholderIfAbsent=true&apiKey=373b523e13e642948ff7f7e522970fd3" alt="" className="object-contain shrink-0 w-40 aspect-square min-h-[160px] min-w-[160px]" />
      <div className="flex flex-col flex-1 shrink basis-0 min-w-[160px] max-md:max-w-full">
        <div className="flex flex-col w-full max-md:max-w-full">
          <h2 className="tracking-tight leading-tight text-xl font-semibold max-md:max-w-full">
            {title}
          </h2>
          <p className="mt-2 leading-snug text-gray-600 text-[length:var(--sds-typography-body-size-medium)] max-md:max-w-full">
            {description}
          </p>
        </div>
        <div className="flex gap-4 items-center mt-4 w-full leading-none whitespace-nowrap font-[number:var(--sds-typography-body-font-weight-regular)] text-[color:var(--sds-color-text-brand-on-brand)] text-[length:var(--sds-typography-body-size-medium)] max-md:max-w-full">
          <button className={'btn-primary'} onClick={handleNavigate}>
            {buttonText}
          </button>
        </div>
      </div>
    </article>
  );
};

export default OptionCard;