import React from 'react'
import ReactDOM from 'react-dom/client'
import { HomePage } from './HomePage'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { initializeApp } from "firebase/app";
import { GamesProvider } from './GamesContext';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { GamePage } from './GamePage';
import { OverviewPage } from './OverviewPage';

const firebaseConfig = {
  apiKey: "AIzaSyDj-HwsjG8HoEI0Xb7rsC4ORC2S6RbekRc",
  authDomain: "videogame-portal.firebaseapp.com",
  projectId: "videogame-portal",
  storageBucket: "videogame-portal.appspot.com",
  messagingSenderId: "167941723373",
  appId: "1:167941723373:web:4025c562e37d8fef17e8e4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const router = createBrowserRouter(
  [
    { path:'/', element:<HomePage />, errorElement: <span>Errore</span> },
    { path:'/games', element:<OverviewPage />, errorElement: <span>Errore Overview</span>},
    { path:'/games/:id', element:<GamePage />, loader: listLoader, errorElement: <span>Errore Pagina Game</span>}
  ]
)

function listLoader({params}:any) {
  return params.id;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GamesProvider>
      <RouterProvider router={router}/>
    </GamesProvider>
  </React.StrictMode>,
)
