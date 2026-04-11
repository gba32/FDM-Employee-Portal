import { useState } from "react";
import "../css/InternalAnnouncement.css";
import { AnnouncementStatus } from "../services/mockPortalData";
import PublishedAnnouncement from "./PublishedAnnouncement";

//PLEASE READ THIS BEFORE IMPLEMENTING: instead of actually deleting the existing announcement, you can create a function that will
// .. show the status "PUBLISHED" announcements only to employees to eliminate announcement with status DELETED
const InternalAnnouncement = ({ repository, setRepository, user }) => {
  
  // states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  // handle submit of announcement
  const handlePublish = (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Make sure to fill in title and content");
      console.log("Did not fill in one of the fields");
      return;
    } 

    const newAnnouncement = {
      announcementID: String(Date.now()),
      empID: user.id, 
      datePublished: new Date().toISOString().split("T")[0],
      announcementStatus: AnnouncementStatus.PUBLISHED, 
      title: title,
      content: content,
    }

    const newRepo = [...repository, newAnnouncement];
    setRepository(newRepo);

    // clear form inputs
    setTitle("");
    setContent("");
  }

  const handleDelete = (aID) => {
    const newRepo = repository.map((announcement) => {
      if (announcement.announcementID === aID) {
        const newAnnouncement = {...announcement, announcementStatus : AnnouncementStatus.DELETED};
        return newAnnouncement; 
      }
      return announcement;
    })

    setRepository(newRepo);
  }


  if (!user) {
    return <p>Loading user data</p>;
  }
  return (
    <div className="announcement-main">
      <h2>Internal Announcement</h2>
      <p>
        Logged in as <b>{user.name}</b>
      </p>

      <div className="announcement-container">
        <div className="ann-left-col">
          {/* Create Announcement */}
          <h3 className="ann-left-title">Create Announcement</h3>
          <form onSubmit={handlePublish} action="">
            <div className="title-box">
              <label htmlFor="title">Title</label>
              <input 
                type="text"
                name="title"
                placeholder="Announcement title..."
                id="title"
                value={title}
                onChange={(e)=>setTitle(e.target.value)} 
              />
            </div>
            <div className="content-box">
              <label htmlFor="content">Content</label>
              <textarea 
                name="content" 
                id="content"
                placeholder="Write your announcement here..."
                value={content}
                onChange={(e)=> setContent(e.target.value)}
              >
              </textarea>
            </div>
            <button
              className="publish-announcement-btn"
              type="submit"
            >Publish Announcement
            </button>
          </form>
        </div>

        <div className="ann-right-col">
          {/* published announcements */}
          <div className="published-cards">
            {repository
            .filter((a) => a.announcementStatus === AnnouncementStatus.PUBLISHED)
            .map((announcement, index) => (
              <PublishedAnnouncement key={index} announcement={announcement} role={user.role} handleDelete={handleDelete} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default InternalAnnouncement;
