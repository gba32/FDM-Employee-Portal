//Acts as the System class/root of the app

import { useState } from "react";
import "./App.css"; //layout styles so use index.css for global styles including font choices, and background colours
import { mockData } from "./services/mockPortalData"; // import hardcoded data

import LoginPage from "./components/LoginPage";
import Dashboard from "./components/DashBoard";

function App() {
  //If currentUser is null, show login, otherwise if useState has a user object show dashboard
  const [currentUser, setCurrentUser] = useState(null);
  //initialise state for Mock repositories
  const [queryRepository, setQueryRepository] = useState(
    mockData.initialQueries,
  );

  //authentication logic
  const handleLogin = (user) => {
    setCurrentUser(user);
  };
  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="appRoot">
      {/*If not logged in, show only login page component */}
      {!currentUser ? (
        <LoginPage onLogin={handleLogin} users={mockData.users}></LoginPage>
      ) : (
        // if logged in, show dashboard containing sidebar and the use case interfaces
        <Dashboard
          user={currentUser}
          queryRepository={queryRepository}
          setRepository={setQueryRepository}
          onLogout={handleLogout}
        ></Dashboard>
      )}
    </div>
  );
}

export default App;
