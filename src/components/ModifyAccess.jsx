import "../css/ModifyAccess.css";
import { PermissionsType } from "../services/mockPortalData";

//PLEASE READ THIS BEFORE IMPLEMENTING: toggle permissions or Role type(changing role type is the same as giving admin rights so no need to have a
// ..checkbox and instead implement a dropdown menu)
const ModifyAccess = ({ repository, setRepository, user }) => {
  if (!user) {
    return <p>Loading user data</p>;
  }
  return (
    <div className="ModifyAccessContainer">
      <h2>User Access Permissions</h2>
      <p>
        Logged in as <b>{user.name}</b>
      </p>
    </div>
  );
};
export default ModifyAccess;
