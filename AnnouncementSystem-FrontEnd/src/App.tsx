import { createBrowserRouter } from 'react-router-dom';

import { Login } from './pages/login'
import { Home } from './pages/home'
import { CriarAnuncio } from "./pages/anuncio/criar";
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

import './index.css'

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
  }

])

export { router };