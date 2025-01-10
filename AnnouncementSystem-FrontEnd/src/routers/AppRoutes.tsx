import {isAuthenticated} from "../services/token.tsx";
import {createBrowserRouter, Navigate, Outlet, RouterProvider} from "react-router-dom";
import {
    pathAssessment,
    pathCommunication,
    pathCreateAds,
    pathFilterAd,
    pathHome,
    pathLogin,
    pathMeusAnuncios,
    pathPerfil, pathVisualizarAnuncio, pathVizualizarAnunciante, pathEditarAnuncio
} from "./Paths.tsx";
import {Login} from "../pages/login/Login.tsx";
import {CriarAnuncio} from "../pages/anuncio/CriarAnuncio.tsx";
import Navbar from "../components/Navbar.tsx";
import Communication from "../pages/communication/Communication.tsx";
import Perfil from "../pages/perfil/Perfil.tsx";
import MeusAnuncios from "../pages/anuncio/MeusAnuncios.tsx";
import Anuncios from "../pages/anuncio/Anuncios.tsx";
import VisualizarAnuncio from "../pages/anuncio/VisualizarAnuncio.tsx";
import { EditarAnuncio } from "../pages/anuncio/EditarAnuncio.tsx";
import Assessment from "../pages/assessment/Assessment.tsx";
import ErrorPage from "../pages/error/ErrorPage.tsx";

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
        errorElement: <ErrorPage />
    },
    {
        element: <ProtectedRoute/>,
        errorElement: <Layout />,
        children: [{
            element: <Layout/>,
            children:[
                {
                    path: pathHome,
                    element: <Anuncios />
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
                    path: pathEditarAnuncio,
                    element: <EditarAnuncio/>
                },
                {
                    path: pathVizualizarAnunciante,
                    element: <Perfil />
                },
                {
                    path: pathAssessment,
                    element: <Assessment/>
                },
                {
                    path: "*",
                    element: <ErrorPage />,
                }
            ]
        }]
    }
])

function AppRoutes() {
    return <RouterProvider router={router}/>
}

export default AppRoutes;