import announcementIcon from "../images/announcement-icon.svg";
import approveIcon from "../images/approveIcon.png";
import bellIcon from "../images/bellIcon.png";
import memberIcon from "../images/memberIcon.png";
import projectIcon from "../images/projectIcon.png";
import React from "react";
import { useState } from "react";
import "../css/DashBoard.css";

import SideBar from "./SideBar";
import SubmitQuery from "./SubmitQuery";
import ResolveHR from "./ResolveHR";
import ResolveIT from "./ResolveIT";
import SubmitLeave from "./submitLeave";
import ApproveLeave from "./ApproveLeave";
import ModifyAccess from "./ModifyAccess";
import InternalAnnouncement from "./InternalAnnouncement";

import { LeaveActionType, LeaveStatus } from "../services/mockPortalData";

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
  //tracks which use case interface to show. is the default page to view
  const [activeTab, setActiveTab] = useState("home");

  //announcement icon for user profile
  // const announcementlogo = (
  //   <img src={announcementIcon} alt="Announcement Icon" />
  // );

  //calculate the number of pending requests based on user's empId
  const pendingCount = leaveRepository.filter(
    (leave) =>
      leave.leaveStatus === LeaveStatus.PENDING && leave.empID === user.id,
  ).length;

  //calculate the number of approved leave requests based on user's empId
  const leaveCount = leaveRepository.filter(
    (leave) =>
      leave.leaveStatus === LeaveStatus.APPROVED && leave.empID === user.id,
  ).length;
  return (
    <div className="dashboardContainer">
      {/* sidebar always shown on use case interface and home page*/}
      <SideBar
        userRole={user.role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      ></SideBar>
      {/* changes based on activeTab */}
      <div className="mainContent">
        {activeTab === "home" && (
          <div className="homeContainer">
            <div className="headerContainer">
              <h2 className="welcomeLabel">
                Welcome back, <span className="nameLabel">{user.name}</span>
              </h2>
              <p>Here's whats happening at FDM today</p>
              {/* <p> Role: {user.role}</p> */}
            </div>
            <div className="panelsContainer">
              <section className="panelBox">
                <h3>Pending Requests</h3>
                <div className="panelRow">
                  <p>{pendingCount}</p>
                  <img src={bellIcon} alt="Bell Icon" />
                </div>
              </section>
              <section className="panelBox">
                <h3>Team Members</h3>
                {/* hardcoded */}
                <div className="panelRow">
                  <p>10</p>
                  <img src={memberIcon} alt="Member Icon" />
                </div>
              </section>
              <section className="panelBox">
                <h3>Upcoming Leave</h3>
                <div className="panelRow">
                  <p>{leaveCount}</p>
                  <img src={approveIcon} alt="Approve Icon" />
                </div>
              </section>
              <section className="panelBox">
                <h3>Active Projects</h3>
                {/* hardcoded */}
                <div className="panelRow">
                  {" "}
                  <p>12</p> <img src={projectIcon} alt="Project Icon" />
                </div>
              </section>
            </div>
            <ul className="feedContainer">
              <h3>Activity Feed</h3>
              {AnnouncementRepository.filter(
                (a) => a.announcementStatus === "PUBLISHED",
              ).map((news) => {
                const foundEmp = employeeRepository.find(
                  (emp) => emp.id === news.empID,
                );

                // optional chaining to get department label based on role
                let deptLabel = "General Announcement"; // in cause label is undefined but shouldnt be
                if (foundEmp?.role === "HR") {
                  deptLabel = "HR Team";
                } else if (foundEmp?.role === "IT") {
                  deptLabel = "IT Department";
                }
                return (
                  <li key={news.announcementID} className="announcementCard">
                    <div className="announcementTop">
                      <div className="profilePicture">
                        <img src={announcementIcon} alt="Announcement Icon" />
                      </div>
                      <section className="details">
                        {/* add if statement for it and hr role */}
                        <p>{deptLabel}</p>
                        <p className="dates"> {news.datePublished}</p>
                      </section>
                    </div>
                    <div className="announcementBottom">
                      <h4>{news.title}</h4>
                      <p>{news.content}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
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
            triggerNotification={triggerNotification}
          ></SubmitLeave>
        )}

        {/*SECURITY REQUIREMENTS: if user role is IT*/}
        {activeTab === "itResolve" && user.role === "IT" && (
          <ResolveIT
            repository={queryRepository}
            setRepository={setQueryRepository}
            user={user}
            employeeRepository={employeeRepository}
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
            employeeRepository={employeeRepository}
            repository={queryRepository}
            setRepository={setQueryRepository}
            user={user}
            triggerNotification={triggerNotification}
          ></ResolveHR>
        )}

        {activeTab === "announcement" &&
          (user.role === "HR" || user.role === "IT") && (
            <InternalAnnouncement
              repository={AnnouncementRepository}
              setRepository={setAnnouncementRepository}
              user={user}
              triggerNotification={triggerNotification}
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
