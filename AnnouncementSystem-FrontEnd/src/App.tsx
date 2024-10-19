import { createBrowserRouter } from "react-router-dom";

import { Login } from './pages/login'
import { Home } from './pages/home'

import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>
  },
  {
    path: '/home',
    element: <Home/>
  }
])

export { router };