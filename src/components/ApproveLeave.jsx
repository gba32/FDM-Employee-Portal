import Popup from "reactjs-popup";
import "../css/ApproveLeave.css";
//LIST OF TASKS: FORMAT DATES (DONE), add a click to view more when processed requests hit to 3
//use pop up similar to annual leave request (done logic. css not done)
//CHECK VIA console.log order of processed requests displayed (fixed via .sort() method)
//stylise notification message

import { LeaveActionType, LeaveStatus } from "../services/mockPortalData";
const ApproveLeave = ({
  leaveRepo,
  setLeaveRepo,
  empRepo,
  setEmpRepo,
  user,
  triggerNotification,
}) => {
  if (!user) {
    return <p>Loading user data</p>;
  }

  //calculate the number of pending requests
  const pendingCount = leaveRepo.filter(
    (leave) => leave.leaveStatus === LeaveStatus.PENDING,
  ).length;

  //return processed requests that are not pending in requestID order
  const processedRequests = leaveRepo
    .filter(
      (leave) =>
        leave.leaveStatus !== LeaveStatus.PENDING &&
        leave.resolverID === user.id,
    )
    .sort((a, b) => a.requestID - b.requestID);

  //format YYYY-MM-DD string to dateTimeFormat object e.g 13 Mar 2026
  const formatDate = (date) => {
    //date is a string, formatted as YYYY-MM-DD
    // 1. deconstruct date string by using .split and store to array
    const dateArray = date.split("-");
    //2. convert each string into integer
    let newDateArray = dateArray.map(Number);
    //3. take month and subtract by 1 because Date constructor accepts month as  0 index
    const year = newDateArray[0];
    console.log(year);
    const month = newDateArray[1] - 1;
    console.log(month);
    const day = newDateArray[2];
    console.log(day);

    //4. pass to Date constructor => (1995,11,17)
    const newDate = new Date(year, month, day);
    console.log(newDate);

    //  5. new Intl.DateTimeFormat("en-GB", {day: "numeric", month: "short", year: "numeric"}).format(date)
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(newDate);
  };

  // return emp object
  const returnProcessedRequestDetails = (leave) => {
    const foundEmp = empRepo.find((emp) => emp.id === leave.empID);

    return (
      <li key={leave.requestID} className="requestBox">
        <div className="processedRequestTop">
          <section className="details">
            <p className="name">{foundEmp.name}</p>
            <p className="dates">
              {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
            </p>
          </section>
          <section className="statusLabel">
            <p
              className={
                leave.leaveStatus === LeaveStatus.APPROVED
                  ? "approvedLabel"
                  : "rejectedLabel"
              }
            >
              {leave.leaveStatus}
            </p>
          </section>
        </div>

        <div className="processedRequestBottom">
          <p>{leave.reason}</p>
        </div>
      </li>
    );
  };

  //get processed requests if status is not pending
  const processedRequestsCount = leaveRepo.filter(
    (leave) =>
      leave.leaveStatus !== LeaveStatus.PENDING && leave.resolverID === user.id,
  ).length;

  //2. done as a function handler: If manager clicked the approve button displayed on one of the annual leave request object..
  const handleApprove = (balance, request) => {
    if (balance >= request.totalDays) {
      //3ai)update LeaveStatus from PENDING TO APPROVED
      // create a new array with map
      const newleaveRepo = leaveRepo.map((leaveItem) => {
        if (leaveItem.requestID === request.requestID) {
          //create new object for changed leave request
          return {
            ...leaveItem,
            leaveStatus: LeaveStatus.APPROVED,
            // set resolverID to user ID of logged in user (manager)
            resolverID: user.id,
          };
        } else {
          return leaveItem;
        }
      });
      //update state with new array
      setLeaveRepo(newleaveRepo);

      //3bi) deduct balance based on totalDays
      const newEmpRepo = empRepo.map((empItem) => {
        if (empItem.id === request.empID) {
          const newLeaveBalance = empItem.leaveBalance - request.totalDays;

          console.log(`old balance: ${empItem.leaveBalance}`);
          console.log(`new balance: ${newLeaveBalance}`);

          //create new user object and replaces old object in new copy of array
          return {
            //using spread syntax to ensure object with initial properties are kept
            ...empItem,
            //modify exiting properties
            leaveBalance: newLeaveBalance,
          };
        } else {
          //return original object with original repo.
          return empItem;
        }
      });
      setEmpRepo(newEmpRepo);
      triggerNotification(`Success: ${LeaveActionType.APPROVED_REQUEST}`);
      console.log("nofitication trigger?", !!triggerNotification);
    }
    //3aii)otherwise send to manager that balance is insufficient to manager.
    //approve is prevented
    else {
      alert("Cannot approve: Employee has insufficient leave balance");
      //automate reject request
      const rejectedRepo = leaveRepo.map((leaveItem) => {
        if (leaveItem.requestID === request.requestID) {
          return {
            ...leaveItem,
            leaveStatus: LeaveStatus.REJECTED,
            resolverID: user.id,
            //Change message to alert to use reason of rejected approve leave request
            reason: `Rejected: ${leaveItem.reason}. Insufficient leave balance`,
          };
        } else {
          return leaveItem;
        }
      });
      setLeaveRepo(rejectedRepo);

      //send REJECTED_REQUEST to manager
      triggerNotification(
        `${LeaveActionType.REJECTED_REQUEST} due to low leave balance.`,
      );
      console.log("nofitication trigger?", !!triggerNotification);
    }
  };

  //1. done: get all annual leave request objects if LeaveStatus===PENDING from repository displayed
  //2. done as a function handler: If manager clicked the approve button displayed on one of the annual leave request object..
  //2a)get the leave balance via employee's id
  //3. check if balance >= totalDays is true
  //3ai)update LeaveStatus from PENDING TO APPROVED
  // set resolverID to user ID of logged in user (manager)
  //3bi) deduct balance based on totalDays
  //3ci) send LeaveActionType as APPROVED_REQUEST for Employee and Manager
  //3aii)otherwise send to manager that balance is insufficient to manager.
  //approve is prevented
  //instead manager reject request and send REJECTED_REQUEST to employee with reason
  return (
    <div className="ApproveLeaveContainer">
      <div className="subContainer">
        <header className="approveHeader">
          <div className="heading">
            <h1>Approve Leave Requests</h1>
          </div>

          <div className="paragraph">
            <p>Review and approve annual leave requests.</p>
          </div>
          {/* <p>Logged in as {user.name}</p> */}
        </header>

        <section className="requestContainer">
          <ul className="PendingRequestContainer">
            {pendingCount > 0 ? (
              <h2>Pending Requests ({pendingCount})</h2>
            ) : (
              <p className="noPendingLabel">
                No pending requests at this time.
              </p>
            )}

            {/* display pending leave request on panel */}
            {/* DYNAMIC LIST: use .map() to loop through the leaveRepo array and create a <li> item for each pending request */}
            {/* find the name of employee based on empId from leave request */}
            {/* find() returns first element in array*/}
            {leaveRepo
              .filter((leave) => leave.leaveStatus === LeaveStatus.PENDING)
              .sort((a, b) => a.requestID - b.requestID)
              .map((leave) => {
                const foundEmp = empRepo.find((emp) => emp.id === leave.empID);
                // React standard to use unique id to track each leave request
                return (
                  <li key={leave.requestID} className="requestBox">
                    <div className="pendingRequestTop">
                      <div className="profilePicture">
                        {foundEmp.name.charAt(0)}
                      </div>
                      <section className="details">
                        <p>{foundEmp.name}</p>
                        <p className="dates">
                          {formatDate(leave.startDate)} -{" "}
                          {formatDate(leave.endDate)}
                        </p>
                      </section>
                    </div>

                    <div className="pendingRequestBottom">
                      <p>{leave.reason}</p>

                      {/*2a)get the leave balance via employee's id */}
                      <button
                        className="approveBtn"
                        onClick={() =>
                          handleApprove(foundEmp.leaveBalance, leave)
                        }
                      >
                        Approve
                      </button>
                      {/* <button>Reject</button> */}
                    </div>
                  </li>
                );
              })}
          </ul>

          <ul className="ProcessedContainer">
            <h2>Recently Processed</h2>
            {/* show recently processed leave requests based on order  resolverID */}
            {/* show only the first 3 requests */}
            {processedRequests.slice(0, 3).map(returnProcessedRequestDetails)}

            <div className="requestsHistoryContainer">
              {/* check when processed requests is greater than 3 */}
              {processedRequestsCount >= 3 && (
                <Popup
                  trigger={
                    <button className="clickMoreBtn">Click to view more</button>
                  }
                  modal
                  nested
                >
                  {(close) => (
                    <div className="modal">
                      <div className="content">
                        {/* get remaining processed leave requests */}
                        <ul className="ProcessedContainer">
                          <h2>Processed Requests History</h2>

                          {/* show recently processed leave requests based on resolverID */}
                          {processedRequests.map(returnProcessedRequestDetails)}
                        </ul>
                        <div className="closePopUp">
                          <button
                            className="closePopUpBtn"
                            onClick={() => close()}
                          >
                            ✖
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Popup>
              )}
            </div>
          </ul>
        </section>
      </div>
    </div>
  );
};
export default ApproveLeave;
