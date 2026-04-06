import "../css/SubmitQuery.css";

import { QueryStatus, QueryType } from "../services/mockPortalData";

const SubmitQuery = ({ queryRepository, setRepository, user }) => {
  if (!user) {
    return <p>Loading user data</p>;
  }
  return (
    <div className="query-page">
      <h1>Employment Query</h1>
      <p className="subtitle">
        Submit questions about your employment, benefits, or policies
      </p>

      <div className="query-container">
        {/* LEFT: FORM */}
        <div className="query-form">
          <h2>Submit New Query</h2>

          <label>Subject</label>
          <input type="text" placeholder="Brief subject line..." />

          <label>Your Question</label>
          <textarea placeholder="Describe your employment query in detail..." />

          <button className="submit-btn">Submit Query</button>
        </div>

        {/* QUERY LIST */}
        <div className="query-list">
          <h2>Your Previous Queries</h2>

          <div className="query-card">
            <h3>Payroll Question</h3>
            <p>Mar 20, 2026</p>
            <span className="status resolved">Resolved</span>
          </div>

          <div className="query-card">
            <h3>Contract Review</h3>
            <p>Mar 15, 2026</p>
            <span className="status in-progress">In Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SubmitQuery;
