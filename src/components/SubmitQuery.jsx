/*
* Employment Query Submission
* Sepehr Azadi-Harsini
* 240540030
*/

import "../css/SubmitQuery.css";
import { QueryStatus, QueryType } from "../services/mockPortalData";
import React, { useState } from "react";


const SubmitQuery = ({ queryRepository, setRepository, user }) => {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [queries, setQueries] = useState([]);

  const handleSubmit = () => {
    if (!subject || !question) return;

    const newQuery = {
      id: Date.now(),
      subject,
      question,
      date: new Date().toLocaleDateString(),
      status: "In Progress",
    };

    setQueries([newQuery, ...queries]);

    setSubject("");
    setQuestion("");
  };

  if (!user) {
    return <p>Loading user data</p>;
  }
  return (
    <div className="query-page">
      <h1 className="title">
        <span className="icon">💬</span> Employment Query
      </h1>

      <p className="subtitle">
        Submit questions about your employment, benefits, or policies
      </p>

      <div className="query-container">

        {/* LEFT: FORM */}
        <div className="query-form">
          <h2>Submit New Query</h2>

          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief subject line..."
          />

          <label>Your Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Describe your employment query in detail..."
          />

          <button className="submit-btn" onClick={handleSubmit}>
            Submit Query
          </button>
        </div>

        {/* RIGHT: QUERY LIST */}
        <div className="query-list">
          <h2>Your Previous Queries</h2>

          {queries.map((q) => (
            <div key={q.id} className="query-card">
              <div>
                <h3>{q.subject}</h3>
                <p>{q.date}</p>
              </div>

              <span
                className={`status ${
                  q.status === "Resolved" ? "resolved" : "in-progress"
                }`}
              >
                {q.status}
              </span>
            </div>
          ))}

          {/* EMPTY BOX */}
          <div className="empty-box">
            Additional query history...
          </div>
        </div>

      </div>
    </div>
  );
};
export default SubmitQuery;
