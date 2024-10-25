import React from 'react';

export interface CategoryTagProps {
    name: string;
    onRemove?: () => void;
  }

export const CategoryTag: React.FC<CategoryTagProps> = ({ name, onRemove }) => (
  <div className="flex flex-1 gap-2 justify-center items-center p-2 bg-sky-800 rounded-lg">
    <div className="self-stretch my-auto text-[color:var(--sds-color-text-brand-on-brand)]">
      {name}
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>

    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/373b523e13e642948ff7f7e522970fd3/f89e1e9fe0420ffd02eb4582cffc5411ca3bbe1c9bb80402ca688418e1f9b069?apiKey=373b523e13e642948ff7f7e522970fd3&"
      alt=""
      
      className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
      onClick={onRemove}
      role="button"
      tabIndex={0}
    />
  </div>
);

export default CategoryTag;