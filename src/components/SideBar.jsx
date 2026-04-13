import { useState } from "react";
import "../css/SideBar.css";

const SideBar = ({ userRole, activeTab, setActiveTab, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sideBarContainer ${isCollapsed ? "collapsed" : ""}`}>
      <header>
        <img src="src\images\logoBlack.png" alt="FDM" />
        {!isCollapsed && <p>Employement Portal</p>}
        <button
          type="button"
          className="sidebarToggle"
          onClick={() => setIsCollapsed((current) => !current)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? ">>" : "<<"}
        </button>
      </header>

      <nav>
        <div className="navigationContainer">
          <button
            className={activeTab === "home" ? "active" : ""}
            onClick={() => setActiveTab("home")}
          >
            <img src="src/images/sidebar-icons/Home.svg" alt="Home" />
            <span className="sidebarLabel">Home</span>
          </button>

          {/* visible to everyone */}
          <button
            className={activeTab === "submitEmpQuery" ? "active" : ""}
            onClick={() => setActiveTab("submitEmpQuery")}
          >
            <img
              src="src/images/sidebar-icons/EmploymentQuery.svg"
              alt="Employment Query"
            />
            <span className="sidebarLabel">Employment Query</span>
          </button>

          {/* Manager doesnt see the leave request */}
          {userRole !== "Manager" && (
            <button
              className={activeTab === "submitLeave" ? "active" : ""}
              onClick={() => setActiveTab("submitLeave")}
            >
              <img
                src="src/images/sidebar-icons/RequestLeave.png"
                alt="request leave"
              />
              <span className="sidebarLabel">Request Leave</span>
            </button>
          )}

          {/* Conditional rendering of buttons: only show if the user has the right role */}
          {userRole === "IT" && (
            <button
              className={activeTab === "itResolve" ? "active" : ""}
              onClick={() => setActiveTab("itResolve")}
            >
              <img
                src="src/images/sidebar-icons/TechnicalQueries.png"
                alt="Technical Queries"
              />
              <span className="sidebarLabel">Technical Queries</span>
            </button>
          )}

          {userRole === "IT" && (
            <button
              className={activeTab === "modifyAccess" ? "active" : ""}
              onClick={() => setActiveTab("modifyAccess")}
            >
              <img
                src="src/images/sidebar-icons/User Access.svg"
                alt="User Access"
              />
              <span className="sidebarLabel">User Access</span>
            </button>
          )}

          {userRole === "HR" && (
            <button
              className={activeTab === "hrResolve" ? "active" : ""}
              onClick={() => setActiveTab("hrResolve")}
            >
              <img
                src="src/images/sidebar-icons/HRQuery.svg"
                alt="HR Queries"
              />
              <span className="sidebarLabel">HR Queries</span>
            </button>
          )}

          {(userRole === "HR" || userRole === "IT") && (
            <button
              className={activeTab === "announcement" ? "active" : ""}
              onClick={() => setActiveTab("announcement")}
            >
              <img
                src="src/images/sidebar-icons/Announcements.svg"
                alt="Announcements"
              />
              <span className="sidebarLabel">Announcements</span>
            </button>
          )}

          {userRole === "Manager" && (
            <button
              className={activeTab === "approveLeave" ? "active" : ""}
              onClick={() => setActiveTab("approveLeave")}
            >
              <img
                src="src/images/sidebar-icons/ApproveLeave.svg"
                alt="Approve Leave"
              />
              <span className="sidebarLabel">Approve Leave</span>
            </button>
          )}
        </div>

        {/* logout button shown to everyone */}
        <div className="logout">
          <hr />
          <button onClick={onLogout}>
            <img src="src/images/sidebar-icons/Logout.svg" alt="logout" />
            <span className="sidebarLabel logoutLabel">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
