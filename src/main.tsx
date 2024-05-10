import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { HomePage } from './HomePage'
import { LoginPage } from './LoginPage';
import { OverviewPage } from './OverviewPage';
import { GamePage } from './GamePage';
import { MyGamesPage } from './MyGamesPage';
import { GamesProvider } from './GamesContext';
import { UserProvider } from './UserContext';

import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { disableNetwork, enableNetwork, initializeFirestore, persistentLocalCache } from 'firebase/firestore';

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
export const db = initializeFirestore(app, {localCache: persistentLocalCache()}); // Enables persistent local cache for offline experience

const router = createBrowserRouter(
  [
    { path:'/', element:<HomePage />, errorElement: <span>Errore</span> },
    { path:'/login', element:<LoginPage />, errorElement: <span>Errore Login</span>},
    { path:'/genres/:label', element:<OverviewPage />, loader:listLoaderLabel, errorElement: <span>Errore Overview</span>},
    { path:'/games/:id', element:<GamePage />, loader: listLoaderId, errorElement: <span>Errore Pagina Game</span>},
    { path:'/mygames', element:<MyGamesPage />, errorElement: <span>Errore MyGames</span>},
    { path:'/search/:label', element:<OverviewPage />, loader:listLoaderLabel, errorElement: <span>Errore Overview</span>},
  ]
);

function listLoaderId({params}:any) {
  return params.id;
}

function listLoaderLabel({params}:any) {
  return params.label;
}

let status = navigator.onLine;

export const isOnline = () => {
  return status;
}

// Manage switch from online to offline
window.addEventListener('offline', () => {
  disableNetwork(db);
  status = false;
});

// Handles switch from offline to online
window.addEventListener('online', () => {
  enableNetwork(db);
  status = true;
  location.reload(); // If app turns back online reloads page
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GamesProvider>
      <UserProvider>
        <RouterProvider router={router}/>
      </UserProvider>
    </GamesProvider>
  </React.StrictMode>,
)
