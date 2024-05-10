# Videogame Portal

### Information
Videogame Portal is a Progressive Web App (PWA) that allows users to explore a videogame database. Each game in the database contains scores based on various categories. If you sign in, you can add games to your personal library called *mygames* and submit your votes.

The app has been implemented using **React**, **Typescript**, and **Vite**.

### How to run
In the terminal run commands:
1. Install dependencies: `npm i`
2. Build the app: `npm run build`
3. Start the server: `npm run start`

### How to use
Let’s break down the different sections of the app:

#### Home Page
- The home page features a game viewer where four random games from the database slide every 20 seconds.
- You can click on the title or directly on the cover to navigate to the game page.
- Clicking on the genre takes you to an overview page containing all games of that genre.
- Below the game viewer, there are two carousels where you can navigate through games using arrows or by clicking on the cover.

#### App Header
- `VGP Logo`: Redirects to homepage.
- `Menu`: Opens a dropdown menu where you can choose a genre or view all games.
- `Searchbar`:  As you type, a dropdown window appears with a maximum of 5 suggested games. Press `Enter` or click the search button to show all search results.
- `MyGames`: If you are logged in, it redirects to the MyGames page; otherwise, it redirects to the login page.
- `Sign In`: Redirects to login page.
- `Logout`: Logs out and redirects to homepage.

#### Login Page
- If you are online, you can sign in using email and password or directly with google.

#### Game Page
- If you are logged in, you can use `+ Add to MyGames` to add the game to your personal library
- Two buttons will appear:
  - `- Remove from MyGames`: Removes the game from your library.
  - `Vote`: Opens a modal where you can submit your votes (from 1 to 10 with a maximum of one decimal).
- You can also navigate to the genre page by clicking on genres under the game cover.

#### Genres Page
- Displays all games from the selected genre.
- Clicking on a game redirects you to the game page.

#### MyGames
- Shows stats related to your account at the top.
- Below, you’ll find your saved games, similar to the Genres page.

#### Test Account
To explore all functionalities of the app without creating a new account, use the following test user credentials:
- **Username**: `account@test.com`
- **Password**: `test1234`

#### Offline Experience
- If you are already logged in and the connection turns offline, you can use all functionality of the app, and once back online, changes will be uploaded to firestore.
- If you aren't logged in and the connection turns offline, you can still explore the site, minus the functionalities reserved for logged-in users.
- In both cases, if the game's covers have not been previosly loaded, a fallback image will be displayed when offline.