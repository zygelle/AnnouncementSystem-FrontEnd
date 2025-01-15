import {isAuthenticated} from "../services/token.tsx";
import {createBrowserRouter, Navigate, Outlet, RouterProvider} from "react-router-dom";
import {
    pathCommunication,
    pathCreateAds,
    pathFilterAd,
    pathHome,
    pathLogin,
    pathMeusAnuncios,
    pathPerfil, pathVisualizarAnuncio, pathVizualizarAnunciante
} from "./Paths.tsx";
import {Login} from "../pages/login/Login.tsx";
import {Home} from "../pages/home/Home.tsx";
import {CriarAnuncio} from "../pages/anuncio/criar";
import Navbar from "../components/Navbar.tsx";
import Communication from "../pages/communication/Communication.tsx";
import Perfil from "../pages/perfil/Perfil.tsx";
import MeusAnuncios from "../pages/anuncio/MeusAnuncios.tsx";
import Anuncios from "../pages/anuncio/Anuncios.tsx";
import Anunciante from "../pages/perfil/Anunciante.tsx";
import VisualizarAnuncio from "../pages/anuncio/VisualizarAnuncio.tsx";

const ProtectedRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to={pathLogin} />;
}

const Layout = () => (
    <>
        <Navbar/>
        <Outlet/>
    </>
)

const router = createBrowserRouter([
    {
        path: pathLogin,
        element: <Login/>,
    },
    {
        element: <ProtectedRoute/>,
        children: [{
            element: <Layout/>,
            children:[
                {
                    path: pathHome,
                    element: <Home/>
                },
                {
                    path: pathCreateAds,
                    element: <CriarAnuncio/>
                },
                {
                    path: pathFilterAd,
                    element: <Anuncios/>
                },
                {
                    path: pathCommunication,
                    element: <Communication/>
                },
                {
                    path: pathPerfil,
                    element: <Perfil/>
                },
                {
                    path: pathMeusAnuncios,
                    element: <MeusAnuncios/>
                },
                {
                    path: pathVisualizarAnuncio,
                    element: <VisualizarAnuncio/>
                },
                {
                    path: pathVizualizarAnunciante,
                    element: <Anunciante />
                }
            ]
        }]
    }
])

function AppRoutes() {
    return <RouterProvider router={router}/>
}

export default AppRoutes;