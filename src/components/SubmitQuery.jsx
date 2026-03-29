const SubmitQuery = ({ queryRepository, setRepository, user }) => {
  if (!user) {
    return <p>Loading user data</p>;
  }
  return (
    <div className="SubmitQueryContainer">
      <h2>Submit Employment Query</h2>
      <p>
        Logged in as <b>{user.name}</b>
      </p>
    </div>
  );
};
export default SubmitQuery;
