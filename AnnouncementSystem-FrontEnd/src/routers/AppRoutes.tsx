import {isAuthenticated} from "../services/token.tsx";
import {createBrowserRouter, Navigate, Outlet, RouterProvider} from "react-router-dom";
import {pathCreateAds, pathHome, pathLogin} from "./Paths.tsx";
import Header from "../components/header";
import {Login} from "../pages/login";
import {Home} from "../pages/home";
import {CriarAnuncio} from "../pages/anuncio/criar";

const ProtectedRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to={pathLogin} />;
}

const Layout = () => (
    <>
        <Header/>
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
                }
            ]
        }]
    }
])

function AppRoutes() {
    return <RouterProvider router={router}/>
}

export default AppRoutes;