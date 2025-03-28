import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {HeroUIProvider} from '@heroui/react'
import { createBrowserRouter, createRoutesFromChildren, Route, RouterProvider } from 'react-router-dom'
import Todos from './components/Todos.jsx'
import HomePage from './components/Home.jsx'
import Login from './components/Login.jsx'
import Register from './components/Signup.jsx'

const routes = createBrowserRouter(
  createRoutesFromChildren(
    <Route path='/' element={<App />} >
    <Route path="" element={<HomePage />} />,
    <Route path="todos" element={<Todos />} />,
    <Route path="login" element={<Login />} />,
    <Route path="signup" element={<Register />} />
    </Route>
  )
)



createRoot(document.getElementById('root')).render(
  <StrictMode>
     <HeroUIProvider>
      <RouterProvider router={routes}/>
    </HeroUIProvider>
  </StrictMode>
 
)
