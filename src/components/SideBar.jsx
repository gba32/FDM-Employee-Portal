import "../css/SideBar.css";
const SideBar = ({ userRole, activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="sideBarContainer">
      <header>
        <img src="src\images\logoBlack.png" alt="FDM" />
        <p>Employement Portal</p>
      </header>

      <nav>
        <div className="navigationContainer">
          <button
            className={activeTab === "home" ? "active" : ""}
            onClick={() => setActiveTab("home")}
          ><img src="src/images/whiteSidebarIcons/Home.svg" alt="Home" />Home</button>
          {/* visible to everyone */}
          <button
            className={activeTab === "submitEmpQuery" ? "active" : ""}
            onClick={() => setActiveTab("submitEmpQuery")}
          >
            <img src="src/images/whiteSidebarIcons/EmploymentQuery.svg" alt="Employment Query" />Employment Query
          </button>

          {/* Manager doesnt see the leave request */}
          {userRole !== "Manager" && (
            <button
              className={activeTab === "submitLeave" ? "active" : ""}
              onClick={() => setActiveTab("submitLeave")}
            >
              <img src="src/images/whiteSidebarIcons/RequestLeave.png" alt="request leave" />Request Leave
            </button>
          )}

          {/* Conditional rendering of buttons: only show if the user has the right role */}
          {userRole === "IT" && (
            <button
              className={activeTab === "itResolve" ? "active" : ""}
              onClick={() => setActiveTab("itResolve")}
            >
              <img src="src/images/blackSidebarIcons/TechnicalQueries.svg" alt="Technical Queries" />Technical Queries
            </button>
          )}

          {userRole === "IT" && (
            <button
              className={activeTab === "modifyAccess" ? "active" : ""}
              onClick={() => setActiveTab("modifyAccess")}
            >
              <img src="src/images/whiteSidebarIcons/UserAccess.svg" alt="User Access" />User Access
            </button>
          )}

          {userRole === "HR" && (
            <button
              className={activeTab === "hrResolve" ? "active" : ""}
              onClick={() => setActiveTab("hrResolve")}
            >
              <img src="src/images/whiteSidebarIcons/HRQuery.svg" alt="HR Queries" />HR Queries
            </button>
          )}

          {userRole === "HR" && (
            <button
              className={activeTab === "announcement" ? "active" : ""}
              onClick={() => setActiveTab("announcement")}
            >
              <img src="src/images/whiteSidebarIcons/Announcements.svg" alt="Announcements" />Announcements
            </button>
          )}

          {userRole === "Manager" && (
            <button
              className={activeTab === "approveLeave" ? "active" : ""}
              onClick={() => setActiveTab("approveLeave")}
            >
              <img src="src/images/whiteSidebarIcons/ApproveLeave.svg" alt="Approve Leave" />Approve Leave
            </button>
          )}
        </div>

        {/* logout button shown to everyone */}
        <div className="logout" >
          <button onClick={onLogout}> <img src="src/images/whiteSidebarIcons/Logout.svg" alt="logout" />Logout </button>
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
