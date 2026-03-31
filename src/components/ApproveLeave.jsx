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
  return (
    <div className="ApproveLeaveContainer">
      <h2>Annual Leave Requests</h2>
      <p>
        Logged in as <b>{user.name}</b>
      </p>
    </div>
  );
};
export default ApproveLeave;
