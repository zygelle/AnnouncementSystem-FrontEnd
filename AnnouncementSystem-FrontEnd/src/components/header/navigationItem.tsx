import React from 'react';

interface NavigationItemProps {
  label: string;
  isActive?: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ label, isActive = false }) => {
  return (
    <li className={`gap-2 self-stretch p-2 my-auto rounded-lg ${isActive ? 'bg-neutral-100 text-[color:var(--sds-color-text-brand-on-brand-secondary)]' : ''}`}>
      {label}
    </li>
  )
}

export default NavigationItem;