/*
* Employment Query Submission
* Sepehr Azadi-Harsini
* 240540030
*/

import "../css/SubmitQuery.css";
import { QueryStatus, QueryType } from "../services/mockPortalData";
import React, { useState, useEffect } from "react";


const SubmitQuery = ({ queryRepository, setRepository, user }) => {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [queries, setQueries] = useState([]);
  const [queryType, setQueryType] = useState(QueryType.HRQUERY);

  useEffect(() => {
    const savedQueries = localStorage.getItem("queries");

    if (savedQueries) {
      const parsed = JSON.parse(savedQueries);
      setQueries(parsed);
      setRepository(parsed);
    }
  }, []);

  const handleSubmit = () => {
    if (!subject || !question) return;

    const newQuery = {
      id: Date.now(),
      subject,
      question,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      status: QueryStatus.IN_PROGRESS, 
      type: QueryType.EMPLOYMENT,      
    };

    const updatedQueries = [newQuery, ...queries];

    // update local state
    setQueries(updatedQueries);

    // update shared/global repository
    setRepository(updatedQueries);

    // persist to browser
    localStorage.setItem("queries", JSON.stringify(updatedQueries));

    setSubject("");
    setQuestion("");
  };

  if (!user) {
    return <p>Loading user data</p>;
  }
  return (
    <div className="query-page">
      <h1 className="title">
        <span className="icon" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
              stroke="#C5FF00"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        Employment Query
      </h1>

      <p className="subtitle">
        Submit questions about your employment, benefits, or policies
      </p>

      <div className="query-container">

        {/* LEFT: FORM */}
        <div className="query-form">
          <h2>Submit New Query</h2>
          
          <div className="toggle-container">
            <button
            className={`toggle-btn ${
              queryType === QueryType.HRQUERY ? "active" : ""
            }`}
            onClick={() => setQueryType(QueryType.HRQUERY)}
            >HR Query</button>

            <button
              className={`toggle-btn ${
                queryType === QueryType.ITQUERY ? "active" : ""
            }`}
            onClick={() => setQueryType(QueryType.ITQUERY)}
          >IT Query</button>
        </div>

          <label className="field-label">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief subject line..."
          />

          <label className="field-label">Your Question</label>
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
              <div className="query-text">
                <h3>{q.subject}</h3>
                <p>{q.date}</p>
              </div>

              <span
                className={`status ${
                  q.status === QueryStatus.RESOLVED ? "resolved" : "in-progress"
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
