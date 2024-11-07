import {Link, NavLink} from "react-router-dom";
import React from "react";
import {
    pathCommunication,
    pathCreateAds,
    pathFilterAd,
    pathHome, pathLogin,
    pathMeusAnuncios,
    pathPerfil
} from "../../routers/Paths.tsx";
import {logout} from "../../services/token.tsx";

interface NavigationItemProps {
    label: string;
    path: string;
    onClick?: () => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ label, path, onClick }) => {
    return (
        <li>
            <NavLink
                to={path}
                onClick={onClick}
                className={({ isActive }) =>
                    `gap-2 self-stretch p-2 my-auto rounded-lg ${
                        isActive ? 'bg-neutral-100 text-[color:var(--sds-color-text-brand-on-brand-secondary)]' : ''
                    }`
                }
            >
                {label}
            </NavLink>
        </li>
    );
}
const handleLogout = () => {
    logout()
}

function Navbar() {

    const navigationItems = [
        { label: 'Criar anúncio', path: pathCreateAds },
        { label: 'Buscar anúncio', path: pathFilterAd },
        { label: 'Comunicação', path: pathCommunication },
        { label: 'Perfil', path: pathPerfil },
        { label: 'Meus anúncios', path: pathMeusAnuncios },
        { label: 'Sair', path: pathLogin }
    ];

    return (
        <nav className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-8 items-center p-4 mb-0 mx-auto w-full bg-white border-b border-zinc-300 sm:px-5 overflow-hidden">
            <div className="flex justify-start">
                <Link to={pathHome}>
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/64f13c3f11b23f2f29cc666aa089fd3ca99c780c0200160b0f96e53c06ebeefd?placeholderIfAbsent=true&apiKey=373b523e13e642948ff7f7e522970fd3"
                        alt="Company logo"
                        className="w-[82px] aspect-[1.32] object-left object-fill shrink-0"
                    />
                </Link>
            </div>
            <ul className="flex flex-wrap gap-6 sm:gap-8 sm:flex-row">
                {navigationItems.map((item, index) => (
                    <NavigationItem
                        key={index}
                        label={item.label}
                        path={item.path}
                        onClick={item.label === 'Sair' ? handleLogout : undefined}
                    />
                ))}
            </ul>
        </nav>
    );
}

export default Navbar;