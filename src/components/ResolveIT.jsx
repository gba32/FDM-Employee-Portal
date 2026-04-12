import "../css/ResolveIT.css";
import { useState } from "react";
import { QueryStatus, QueryType } from "../services/mockPortalData";
import resolveHRIcon from '../images/resolveHR-icon.svg';
// ADD NAMES OF EMPLOYEES INSTEAD OF IDS
// ADD DATE IN BETTER FORMAT
// ADD COLOUR CODING FOR STATUS (GREEN FOR RESOLVED, ORANGE FOR PENDING, RED FOR REJECTED)

const ResolveIT = ({ repository, setRepository, user }) => {
  const [note, setNote] = useState({});

  // Basic checks to ensure data is available before rendering
  if (!user) {
    return <p>Loading user data</p>;
  }
  if (!repository) {
    return <p>No available queries</p>; // no queries found
  }

  // Filter queries to only show IT-related ones, then separate into pending and non-pending
  const itQueries = repository.filter((q) => q.queryType === QueryType.ITQUERY);
  const pendingQueries = itQueries.filter((q) => q.queryStatus === QueryStatus.PENDING);
  const otherQueries = itQueries.filter((q) => q.queryStatus !== QueryStatus.PENDING);

  // Handles changes to the resolution note input for each query
  const handleNoteChange = (queryID, value) => {
    setNote((prev) => ({ ...prev, [queryID]: value }));
  };

  // Handles resolving a query by updating its status and adding resolution details
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

  const questionlogo = <img src={resolveHRIcon} alt="[Question Icon]" />;

  return (
    // Header and description of the page
    <div className="ResolveITContainer">
      <header>
        <h1>{questionlogo} IT Queries</h1>
        <p> Resolve IT-related questions and requests from employees</p>
      </header>

      { /* Two-column layout for pending and resolved queries */ }
      <div className="columns-wrapper">
        { /* Left column - Open Queries */ }
        <div className="left-column">
          <h2>Open Queries ({pendingQueries.length})</h2>
          { /* if no pending queries */ }
          {pendingQueries.length === 0 ? (
            <p>No pending IT queries</p>
          ) : (
            pendingQueries.map((query) => (
              <div key={query.queryID}>
                <h2>{query.subject}</h2>
                <h3>{query.reason}</h3>
                <small>Submitted by Employee ID: {query.empID} on {query.dateRequested}</small>
                <div>
                  <input
                    placeholder="Type your response..."
                    type="text"
                    value={note[query.queryID] || ""}
                    onChange={(e) => handleNoteChange(query.queryID, e.target.value)}
                  />
                  <button onClick={() => handleResolve(query.queryID)}>Send Response and Resolve</button>
                </div>
              </div>
            ))
          )}
        </div>

        { /* Right column - Closed Queries */ }
        <div className="right-column">
          <h2 className="column-heading">Closed Queries ({otherQueries.length})</h2>
          {otherQueries.length === 0 ? (
            <p>No closed IT queries</p>
          ) : (
            otherQueries.map((query) => (
              <div key={query.queryID}>
                <h2>{query.subject}</h2>
                <h3>{query.reason}</h3>
                <small>Submitted by Employee ID: {query.empID} on {query.dateRequested}</small>
                <p>Status: {query.queryStatus}</p>
                <p> Resolution Note: {query.resolutionNote || "N/A"}</p>
                <small>Resolved by Employee ID: {query.resolverID} on {query.dateResolved}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default ResolveIT;