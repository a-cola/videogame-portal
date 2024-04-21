import React from 'react'
import ReactDOM from 'react-dom/client'
import { HomePage } from './HomePage'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter(
  [
    {path:'/', element:<HomePage />, errorElement: <span>Errore</span>},
  ]
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
