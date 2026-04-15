import announcementIcon from "../images/announcement-icon.svg";
import deleteIcon from "../images/delete-announcement-icon.svg";
import "../css/PublishedAnnouncement.css";

export default function PublishedAnnouncement({ announcement, role, handleDelete }) {
    return (
        <div className="published-announcement-card">
            <div className="card-header">
                <div className="card-author">
                    <div className="author-avatar">
                        <img src={announcementIcon} alt="" className="author-icon" />
                    </div>
                    <div className="author-meta">
                        <span className="author-name">{role} Team</span>
                        <span className="author-date">{announcement.datePublished}</span>
                    </div>
                </div>
                <button
                    className="delete-btn"
                    onClick={() => handleDelete(announcement.announcementID)}
                    aria-label="Delete announcement"
                >
                    <img src={deleteIcon} alt="Delete" className="delete-icon" />
                </button>
            </div>
            <div className="card-body">
                <h4 className="card-title">{announcement.title}</h4>
                <p className="card-content">{announcement.content}</p>
            </div>
        </div>
    );
}