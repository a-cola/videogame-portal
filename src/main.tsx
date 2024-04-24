import React from 'react'
import ReactDOM from 'react-dom/client'
import { HomePage } from './HomePage'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDj-HwsjG8HoEI0Xb7rsC4ORC2S6RbekRc",
  authDomain: "videogame-portal.firebaseapp.com",
  projectId: "videogame-portal",
  storageBucket: "videogame-portal.appspot.com",
  messagingSenderId: "167941723373",
  appId: "1:167941723373:web:4025c562e37d8fef17e8e4"
};

export const app = initializeApp(firebaseConfig);

const router = createBrowserRouter(
  [
    { path:'/', element:<HomePage />, errorElement: <span>Errore</span> },
  ]
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>,
)
