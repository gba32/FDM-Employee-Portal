import "../css/InternalAnnouncement.css";
import { AnnouncementStatus } from "../services/mockPortalData";

//PLEASE READ THIS BEFORE IMPLEMENTING: instead of actually deleting the existing announcement, you can create a function that will
// .. show the status "PUBLISHED" announcements only to employees to eliminate announcement with status DELETED
const internalAnnouncement = ({ repository, setRepository, user }) => {
  if (!user) {
    return <p>Loading user data</p>;
  }
  return (
    <div className="AnnouncementContainer">
      <h2>Internal Announcement</h2>
      <p>
        Logged in as <b>{user.name}</b>
      </p>
    </div>
  );
};
export default internalAnnouncement;
