import React from "react";
import { useState } from "react";
import "../css/Dashboard.css";

import SideBar from "./SideBar";
import SubmitQuery from "./SubmitQuery";
import ResolveHR from "./ResolveHR";
import ResolveIT from "./ResolveIT";
import SubmitLeave from "./submitLeave";
import ApproveLeave from "./ApproveLeave";
import ModifyAccess from "./ModifyAccess";
import InternalAnnouncement from "./InternalAnnouncement";

const Dashboard = ({
  user,
  queryRepository,
  setQueryRepository,
  leaveRepository,
  setLeaveRepository,
  employeeRepository,
  setEmployeeRepository,
  AnnouncementRepository,
  setAnnouncementRepository,
  onLogout,
  triggerNotification,
}) => {
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
            <h3>Activity Feed</h3>
            {AnnouncementRepository.filter(
              (a) => a.announcementStatus === "PUBLISHED",
            ).map((news) => (
              <div key={news.announcementID} className="announcementCard">
                <h4>{news.title}</h4>
                <p>{news.content}</p>
                <small>Posted on: {news.datePublished}</small>
              </div>
            ))}
          </div>
        )}

        {activeTab === "submitEmpQuery" && (
          <SubmitQuery
            repository={queryRepository}
            setRepository={setQueryRepository}
            user={user}
          ></SubmitQuery>
        )}

        {activeTab === "submitLeave" && (
          <SubmitLeave
            repository={leaveRepository}
            setRepository={setLeaveRepository}
            user={user}
          ></SubmitLeave>
        )}

        {/*SECURITY REQUIREMENTS: if user role is IT*/}
        {activeTab === "itResolve" && user.role === "IT" && (
          <ResolveIT
            repository={queryRepository}
            setRepository={setQueryRepository}
            user={user}
          ></ResolveIT>
        )}

        {activeTab === "modifyAccess" && user.role === "IT" && (
          <ModifyAccess
            repository={employeeRepository}
            setRepository={setEmployeeRepository}
            user={user}
          ></ModifyAccess>
        )}

        {/*SECURITY REQUIREMENTS: if user role is HR*/}

        {activeTab === "hrResolve" && user.role === "HR" && (
          <ResolveHR
            repository={queryRepository}
            setRepository={setQueryRepository}
            user={user}
          ></ResolveHR>
        )}

        {activeTab === "announcement" && user.role === "HR" && (
          <InternalAnnouncement
            repository={AnnouncementRepository}
            setRepository={setAnnouncementRepository}
            user={user}
          ></InternalAnnouncement>
        )}

        {/*SECURITY REQUIREMENTS: if user role is Manager before approving  */}
        {activeTab === "approveLeave" && user.role === "Manager" && (
          <ApproveLeave
            leaveRepo={leaveRepository}
            setLeaveRepo={setLeaveRepository}
            empRepo={employeeRepository}
            setEmpRepo={setEmployeeRepository}
            user={user}
            triggerNotification={triggerNotification}
          ></ApproveLeave>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
