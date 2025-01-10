import {isAuthenticated} from "../services/token.tsx";
import {createBrowserRouter, Navigate, Outlet, RouterProvider} from "react-router-dom";
import {
    pathAssessment,
    pathCommunication,
    pathCreateAds,
    pathFilterAd,
    pathHome,
    pathLogin,
    pathMyAnnouncement,
    pathPerfil, pathViewAd, pathEditarAnuncio, pathViewAdvertiser
} from "./Paths.tsx";
import {Login} from "../pages/login/Login.tsx";
import {CriarAnuncio} from "../pages/anuncio/CriarAnuncio.tsx";
import Navbar from "../components/Navbar.tsx";
import Communication from "../pages/communication/Communication.tsx";
import Perfil from "../pages/perfil/Perfil.tsx";
import MyAnnouncement from "../pages/anuncio/MyAnnouncement.tsx";
import VisualizarAnuncio from "../pages/anuncio/VisualizarAnuncio.tsx";
import { EditarAnuncio } from "../pages/anuncio/EditarAnuncio.tsx";
import Assessment from "../pages/assessment/Assessment.tsx";
import ErrorPage from "../pages/error/ErrorPage.tsx";
import Announcement from "../pages/anuncio/Announcement.tsx";

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
                    element: <Announcement />
                },
                {
                    path: pathCreateAds,
                    element: <CriarAnuncio/>
                },
                {
                    path: pathFilterAd,
                    element: <Announcement />
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
                    path: pathMyAnnouncement,
                    element: <MyAnnouncement />
                },
                {
                    path: pathViewAd,
                    element: <VisualizarAnuncio/>
                },
                {
                    path: pathEditarAnuncio,
                    element: <EditarAnuncio/>
                },
                {
                    path: pathViewAdvertiser,
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