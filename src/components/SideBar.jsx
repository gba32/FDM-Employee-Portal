const SideBar = ({ userRole, setActiveTab, onLogout }) => {
  return (
    <div className="sideBarContainer">
      <h2>FDM Portal</h2>
      <hr />

      <nav>
        <button onClick={() => setActiveTab("home")}>Home</button>
        <button onClick={() => setActiveTab("submitEmpQuery")}>
          Employment Query
        </button>

        {/* Conditional rendering of buttons: only show if the user has the right role */}
        {userRole === "IT" && (
          <button onClick={() => setActiveTab("itResolve")}>
            Technical Queries
          </button>
        )}

        {userRole === "HR" && (
          <button onClick={() => setActiveTab("hrResolve")}>HR Queries</button>
        )}
        <button onClick={onLogout}>Logout</button>
      </nav>
    </div>
  );
};

export default SideBar;
