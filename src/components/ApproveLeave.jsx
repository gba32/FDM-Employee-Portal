import "../css/ApproveLeave.css";

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
            reason: "Insufficient leave balance",
          };
        } else {
          return leaveItem;
        }
      });
      setLeaveRepo(rejectedRepo);

      //send REJECTED_REQUEST to manager
      triggerNotification(
        `System: ${LeaveActionType.REJECTED_REQUEST} due to low leave balance.`,
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
      <h1>Approve Leave Requests</h1>
      <p>Review and approve annual leave requests from your team</p>
      <p>Logged in as {user.name}</p>

      <ul className="PendingRequestContainer">
        {pendingCount > 0 ? (
          <h2>Pending Requests ({pendingCount})</h2>
        ) : (
          <p>No pending requests at this time.</p>
        )}

        {/* display pending leave request on panel */}
        {/* DYNAMIC LIST: use .map() to loop through the leaveRepo array and create a <li> item for each pending request */}
        {/* find the name of employee based on empId from leave request */}
        {/* find() returns first element in array*/}
        {leaveRepo
          .filter((leave) => leave.leaveStatus === LeaveStatus.PENDING)
          .map((leave) => {
            const foundEmp = empRepo.find((emp) => emp.id === leave.empID);
            // React standard to use unique id to track each leave request
            return (
              <li key={leave.requestID}>
                <div className="pendingRequestTop">
                  <p>{foundEmp.name}</p>
                  <p>
                    {leave.startDate}-{leave.endDate}
                  </p>
                </div>

                <div className="pendingRequestBottom">
                  <p>{leave.reason}</p>
                </div>
                {/*2a)get the leave balance via employee's id */}
                <button
                  onClick={() => handleApprove(foundEmp.leaveBalance, leave)}
                >
                  Approve
                </button>
                {/* <button>Reject</button> */}
                <br />
                <br />
              </li>
            );
          })}
      </ul>

      <ul className="ProcessedContainer">
        <h2>Recently Processed</h2>
        {/* show recently processed leave requests based on resolverID */}
        {leaveRepo
          .filter(
            (leave) =>
              leave.leaveStatus !== LeaveStatus.PENDING &&
              leave.resolverID === user.id,
          )
          .map((leave) => {
            const foundEmp = empRepo.find((emp) => emp.id === leave.empID);
            // React standard to use unique id to track each leave request
            return (
              <li key={leave.requestID}>
                <div className="processedRequestTop">
                  <p>Status: {leave.leaveStatus}</p>

                  <p>{foundEmp.name}</p>
                  <p>
                    {leave.startDate}-{leave.endDate}
                  </p>
                  <p>{leave.reason}</p>
                </div>

                <br />
                <br />
              </li>
            );
          })}
      </ul>
    </div>
  );
};
export default ApproveLeave;
