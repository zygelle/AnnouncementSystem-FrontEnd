import { createBrowserRouter } from 'react-router-dom';

import { Login } from './pages/login'
import { Home } from './pages/home'
import { CriarAnuncio } from "./pages/anuncio/criar";
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

import './index.css'
import { BuscarAnuncio } from './pages/anuncio/buscar';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>
  },
  {
    path: '/home',
    element: (
      <PrivateRoute>
          <Home />
      </PrivateRoute>
    ),
  },
  {
    path: '/anuncio/criar',
    element: (
      <PrivateRoute>
          <CriarAnuncio/>
      </PrivateRoute>
    ),
  },{
    path: '/anuncio/buscar',
    element: (
      <PrivateRoute>
          <BuscarAnuncio/>
      </PrivateRoute>
    ),
  }

])

export { router };