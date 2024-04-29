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
import { LoginPage } from './LoginPage';
import { UserProvider } from './UserContext';
import { MyGamesPage } from './MyGamesPage';

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
    { path:'/login', element:<LoginPage />, errorElement: <span>Errore Login</span>},
    { path:'/genres/:label', element:<OverviewPage />, loader:listLoaderLabel, errorElement: <span>Errore Overview</span>},
    { path:'/games/:id', element:<GamePage />, loader: listLoaderId, errorElement: <span>Errore Pagina Game</span>},
    { path:'/mygames', element:<MyGamesPage />, errorElement: <span>Errore MyGames</span>}
  ]
)

function listLoaderId({params}:any) {
  return params.id;
}

function listLoaderLabel({params}:any) {
  return params.label;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GamesProvider>
      <UserProvider>
        <RouterProvider router={router}/>
      </UserProvider>
    </GamesProvider>
  </React.StrictMode>,
)
