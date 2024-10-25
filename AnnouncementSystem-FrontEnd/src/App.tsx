import { createBrowserRouter } from "react-router-dom";

import { Login } from './pages/login'
import { Home } from './pages/home'
import { CriarAnuncio } from "./pages/anuncio/criar";

import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>
  },
  {
    path: '/home',
    element: <Home/>
  },
  {
    path: '/anuncio/criar',
    element: <CriarAnuncio/>
  }

])

export { router };