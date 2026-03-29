const ResolveIT = ({ queryRepository, setRepository, user }) => {
  if (!user) {
    return <p>Loading user data</p>;
  }
  return (
    <div className="ResolveITContainer">
      <h2>IT Queries</h2>
      <p>
        Logged in as <b>{user.name}</b>
      </p>
    </div>
  );
};
export default ResolveIT;
