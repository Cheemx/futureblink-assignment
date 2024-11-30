import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

axios.defaults.withCredentials = true

const router = createBrowserRouter([
    {
        path: "/api",
        element: <App />,
        children:[

        ]
    }
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
