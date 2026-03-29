import { useState } from "react";
import SideBar from "./SideBar";
import SubmitQuery from "./SubmitQuery";
import ResolveHR from "./ResolveHR";
import ResolveIT from "./ResolveIT";

const Dashboard = ({ user, queryRepository, setRepository, onLogout }) => {
  //tracks which use case interface to show. home is the default page to view
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div>
      {/* sidebar always shown on use case interface and home page*/}
      <SideBar
        userRole={user.role}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      ></SideBar>
      {/* changes based on activeTab */}
      <div className="mainContent">
        {activeTab === "home" && (
          <div className="homeContainer">
            <h2>Welcome to the FDM Portal, {user.name}</h2>
            <p> Role: {user.role}</p>
          </div>
        )}

        {activeTab === "submitEmpQuery" && (
          <SubmitQuery
            repository={queryRepository}
            setRepository={setRepository}
            user={user}
          ></SubmitQuery>
        )}

        {activeTab === "itResolve" && user.role === "IT" && (
          <ResolveIT
            repository={queryRepository}
            setRepository={setRepository}
            user={user}
          ></ResolveIT>
        )}

        {activeTab === "hrResolve" && user.role === "HR" && (
          <ResolveHR
            repository={queryRepository}
            setRepository={setRepository}
            user={user}
          ></ResolveHR>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
