import { useState } from "react";

const LoginPage = ({ onLogin, users }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // search for user in mock data
    const foundUser = users.find(
      (u) => u.username === username && u.password === password,
    );
    if (foundUser) {
      // pass user object to App.jsx
      onLogin(foundUser);
    } else {
      alert("Invalid username or password");
      console.log("Incorrect details");
    }
  };

  return (
    <div className="loginContainer">
      <form onSubmit={handleLoginSubmit} className="loginForm">
        <h2>FDM Employee Portal</h2>

        <div className="inputUsernameContainer">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          ></input>
        </div>

        <div className="inputPasswordContainer">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></input>
        </div>

        <button className="loginBtn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
