import "../css/ResolveHR.css";
import { useState } from "react";

import { QueryStatus, QueryType } from "../services/mockPortalData";
const ResolveHR = ({ repository, setRepository, user }) => {
  const [note, setNote] = useState({});

  if (!user) {
    return <p>Loading user data</p>;
  }
  if (!repository) {
    return <p>No available queries</p>; // no queries found
  }

  const hrQueries = repository.filter(
    (q) => q.queryType === QueryType.HRQUERY
  );

  const handleNoteChange = (queryID, value) => {
    setNote((prev) => ({ ...prev, [queryID]: value }));
  };

  const handleResolve = (queryID) => {
    const updatedQueries = repository.map((query) => {
      if (query.queryID === queryID) {
        return { // updates query details to resolved
          ...query,
          queryStatus: QueryStatus.RESOLVED,
          resolverID: user.id,
          dateResolved: new Date().toLocaleDateString(),
          resolutionNote: note[queryID] || "",
        };
      }
      return query;
    });
    setRepository(updatedQueries);
  };

  return (
    <div className="ResolveHRContainer">
      <h2>HR Queries</h2>
      <p>
        Logged in as <b>{user.name}</b>
      </p>
      <br></br>
      {hrQueries.length === 0 ? (
        <p>No HR queries available.</p>
      ) : (
        hrQueries.map((query) => (
          <div key={query.queryID}>
            <h3>Subject:</h3>
            <p>{query.subject}</p>
            <h3>Reason:</h3>
          <p>{query.reason}</p>
          <small> Query ID: {query.queryID}</small>
          <small> Posted on: {query.dateRequested}</small>
          <small> Submitted by Employee ID: {query.empID}</small>

          { /* Resolution Note and Resolve Button */ }
          {query.queryStatus === QueryStatus.PENDING ? (
            <div>
              <label>Resolution Note: </label>
              <input
                type="text"
                value={note[query.queryID] || ""}
                onChange={(e) => handleNoteChange(query.queryID, e.target.value)}
              />
              <button onClick={() => handleResolve(query.queryID)}>
                Resolve Query
              </button>
              <br></br>
            </div>
          ) : (
            <div>
              <p><b>Status:</b> {query.queryStatus}</p>
              <p><b>Resolved by:</b> {query.resolverID}</p>
              <p><b>Date Resolved:</b> {query.dateResolved}</p>
              <p><b>Resolution Note:</b> {query.resolutionNote || "No resolution note provided"}</p>
              <br></br>
            </div>
          )}
        </div>
      )))}
    </div>
  );
};
export default ResolveHR;