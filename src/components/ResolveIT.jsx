import "../css/ResolveIT.css";
import { useState } from "react";
import { QueryStatus, QueryType } from "../services/mockPortalData";
import teamMemberIcon from "../images/teamMembers-icon.svg";

const ResolveIT = ({ repository, setRepository, user,  employeeRepository }) => {
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
  // Checks if a resolution note has been entered before allowing resolution
  const handleResolve = (queryID) => {
    if (!note[queryID]?.trim()) {
      alert("Please enter a resolution note");
      return;
    }
    const updatedQueries = repository.map((query) => {
      if (query.queryID === queryID) {
        return { // updates query details to resolved
          ...query,
          queryStatus: QueryStatus.RESOLVED,
          resolverID: user.id,
          dateResolved: new Date(),
          resolutionNote: note[queryID] || "",
        };
      }
      return query;
    });
    setRepository(updatedQueries);
  };

  const teamMember = <img src={teamMemberIcon} alt="[Team Member Icon]" />;

  // Helper function for converting a date to a triplet
  function dateToTriplet(date){
      date = new Date(date);
      const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

      const day = date.getDate();
      const name = month[date.getMonth()];
      const year = date.getFullYear();

      const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';

      return `${day}${suffix} ${name} ${year}`;
  }

  return (
    // Header and description of the page
    <div className="ResolveITContainer">
      <header>
        <h1>IT Queries</h1>
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
                <h2 className="query-submitter">
                  {teamMember} {employeeRepository.find(emp => emp.id === query.empID)?.name || "Unknown Employee"}
                </h2>
                <p className="query-date">Submitted on: {dateToTriplet(query.dateRequested)}</p>
                <h2>{query.subject}</h2>
                <h3>{query.reason}</h3>
                <div>
                  <input
                    placeholder="Type your response..."
                    type="text"
                    value={note[query.queryID] || ""}
                    onChange={(e) => handleNoteChange(query.queryID, e.target.value)}
                  />
                  <button className="resolve-button" onClick={() => handleResolve(query.queryID)}>Send Response and Resolve</button>
                </div>
              </div>
            ))
          )}
        </div>

        { /* Right column - Resolved Queries */ }
        <div className="right-column">
          <h2 className="column-heading">Resolved Queries ({otherQueries.length})</h2>
          {otherQueries.length === 0 ? (
            <p>No resolved IT queries</p>
          ) : (
            otherQueries.map((query) => (
              <div key={query.queryID}>
                <h2 className="query-submitter">
                  {teamMember} {employeeRepository.find(emp => emp.id === query.empID)?.name || "Unknown Employee"}
                </h2>
                <p className="query-date">Submitted on: {dateToTriplet(query.dateRequested)}</p>
                <h2>{query.subject}</h2>
                <h3>{query.reason}</h3>
                <p> Resolution Note: {query.resolutionNote || "N/A"}</p>
                <small>
                  Resolved by {employeeRepository.find(emp => emp.id === query.resolverID)?.name || "Unknown Employee"} on {dateToTriplet(query.dateResolved)}
                </small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ResolveIT;