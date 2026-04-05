import "../css/ApproveLeave.css";

import { LeaveActionType, LeaveStatus } from "../services/mockPortalData";
const ApproveLeave = ({
  leaveRepo,
  setLeaveRepo,
  empRepo,
  setEmpRepo,
  user,
}) => {
  if (!user) {
    return <p>Loading user data</p>;
  }

  //1.get all annual leave request objects if LeaveStatus===PENDING from repository displayed
  //2. If manager clicked the approve button displayed on one of the annual leave request object..
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
      <h2>Annual Leave Requests</h2>
      <p>
        Logged in as <b>{user.name}</b>
      </p>

      <ul className="PendingRequestContainer">
        {/* DYNAMIC LIST: use .map() to loop through the leaveRepo array and create a <li> item for each pending request */}
        {leaveRepo.map((leave) => (
            {/* display pending leave request on panel */}
            {/* find the name of emloyee based on empId from leave request */}
            const empName = empRepo.find((emp) => emp.id===leave.empID);
          

          return (
            <li
            // React standard to use unique id to track each leave request
            key={leave.requestID}
          >
            <a href="#"> {empName}</a>
          </li>
          //test to see if my commits from my branch only pushes to school account
          )
        ))}
      </ul>
    </div>
  );
};
export default ApproveLeave;
