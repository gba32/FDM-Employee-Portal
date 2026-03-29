const ResolveHR = ({ queryRepository, setRepository, user }) => {
  if (!user) {
    return <p>Loading user data</p>;
  }
  return (
    <div className="ResolveHRContainer">
      <h2>HR Queries</h2>
      <p>
        Logged in as <b>{user.name}</b>
      </p>
    </div>
  );
};
export default ResolveHR;
