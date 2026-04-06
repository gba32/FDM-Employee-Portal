//Acts as the System class/root of the app

import { useState } from "react";
import "./App.css"; //layout styles so use index.css for global styles including font choices, and background colours
import { Repository } from "./services/mockPortalData"; // import hardcoded data

import LoginPage from "./components/LoginPage";
import Dashboard from "./components/DashBoard";

function App() {
  //If currentUser is null, show login, otherwise if useState has a user object show dashboard
  const [currentUser, setCurrentUser] = useState(null);
  //initialise state for repositories to access, read and update
  const [queryRepository, setQueryRepository] = useState(
    Repository.QueryRepository,
  );
  const [leaveRepository, setLeaveRepository] = useState(
    Repository.LeaveRepository,
  );
  const [employeeRepository, setEmployeeRepository] = useState(
    Repository.EmployeeRepository,
  ); //needed for approve annual leave request logic
  //needed for publish internal announcement use case
  const [AnnouncementRepository, setAnnouncementRepository] = useState(
    Repository.AnnouncementRepository,
  );

  //NEW NOTIFICATION:(
  const [notification, setNotification] = useState(null);

  //trigger notification
  const triggerNotification = (message) => {
    setNotification(message);
    //auto hide after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  //authentication logic
  const handleLogin = (user) => {
    setCurrentUser(user);
  };
  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="appRoot">
      {/* NEW NOTIFICATION SYSTEM */}
      {notification && <div>{notification}</div>}
      {/*If not logged in, show only login page component */}
      {!currentUser ? (
        <LoginPage onLogin={handleLogin} users={employeeRepository}></LoginPage>
      ) : (
        // if logged in, show dashboard containing sidebar and the use case interfaces
        <Dashboard
          user={currentUser}
          queryRepository={queryRepository}
          setQueryRepository={setQueryRepository}
          leaveRepository={leaveRepository}
          setLeaveRepository={setLeaveRepository}
          employeeRepository={employeeRepository}
          setEmployeeRepository={setEmployeeRepository}
          AnnouncementRepository={AnnouncementRepository}
          setAnnouncementRepository={setAnnouncementRepository}
          onLogout={handleLogout}
          triggerNotification={triggerNotification}
        ></Dashboard>
      )}
    </div>
  );
}

export default App;
