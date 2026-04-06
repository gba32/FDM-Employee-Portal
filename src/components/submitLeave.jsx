import "../css/submitLeave.css";
import SubmitAnnualLeaveRequest from "./SubmitAnnualLeaveRequest";

import { LeaveActionType, LeaveStatus } from "../services/mockPortalData";
const SubmitLeave = ({ repository, setRepository, user }) => {
  if (!user) {
    return <p>Loading user data</p>;
  }
  return (
    <div className="submitLeaveContainer">
      <h2>Annual Leave Request</h2>
      <p>
        Logged in as <b>{user.name}</b>
      </p>

      <SubmitAnnualLeaveRequest user={user} />
    </div>
  );
};
export default SubmitLeave;
