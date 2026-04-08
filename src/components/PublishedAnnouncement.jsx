export default function PublishedAnnouncement ({announcement, role, handleDelete}) {
    return (
        <div className="published-announcement-card">
            <p>{`${role} Team`}</p>
            <p>{announcement.datePublished}</p>
            <button onClick={()=> (handleDelete(announcement.announcementID))}>🗑️</button>
            <h2>{announcement.title}</h2>
            <p>{announcement.content}</p>
        </div>
    )
}