import { useState } from "react";
import "../css/InternalAnnouncement.css";
import { AnnouncementStatus } from "../services/mockPortalData";
import PublishedAnnouncement from "./PublishedAnnouncement.jsx";
import announcementIcon from "../images/announcement-icon.svg";

const InternalAnnouncement = ({ repository, setRepository, user }) => {

  // states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // publishing announcement
  const handlePublish = (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Make sure to fill in title and content");
      return;
    }
    const newAnnouncement = {
      announcementID: String(Date.now()),
      empID: user.id,
      datePublished: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      announcementStatus: AnnouncementStatus.PUBLISHED,
      title: title,
      content: content,
    };
    setRepository([...repository, newAnnouncement]);
    setTitle("");
    setContent("");
  };

  // deleting announcement
  const handleDelete = (aID) => {
    const newRepo = repository.map((announcement) => {
      if (announcement.announcementID === aID) {
        return { ...announcement, announcementStatus: AnnouncementStatus.DELETED };
      }
      return announcement;
    });
    setRepository(newRepo);
  };

  if (!user) return <p>Loading user data</p>;

  return (
    <div className="announcement-main">
      <h2 className="announcement-page-title">
        <img src={announcementIcon} alt="" className="announcement-title-icon" />
        Internal Announcements
      </h2>
      <p className="announcement-subtitle">
        Publish company-wide announcements to <span className="highlight-all">all</span> employees
      </p>

      <div className="announcement-container">
        {/* Left Col*/}
        <div className="ann-left-col">
          <h3 className="ann-left-title">Create Announcement</h3>
          <form onSubmit={handlePublish}>
            <div className="field-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Announcement title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                placeholder="Write your announcement here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <button className="publish-announcement-btn" type="submit">
              Publish Announcement
            </button>
          </form>
        </div>

        {/* Right Col (published announcement)*/}
        <div className="ann-right-col">
          <h3 className="ann-right-title">Published Announcements</h3>
          <div className="published-cards">
            {repository
              .filter((a) => a.announcementStatus === AnnouncementStatus.PUBLISHED)
              .map((announcement, index) => (
                <PublishedAnnouncement
                  key={index}
                  announcement={announcement}
                  role={user.role}
                  handleDelete={handleDelete}
                />
              ))}
            <div className="additional-announcements-placeholder">
              Additional announcements...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalAnnouncement;
