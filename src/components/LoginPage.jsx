import { useState } from "react";
import "../css/LoginPage.css";

const LoginPage = ({ onLogin, users }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // search for user in EmployeeRepository
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
        <div class="infoContainer">
          <img src="/src/assets/logo.png" id="fdmLogo" />
          <h2>Employee Portal</h2>
          <h3>Sign in to continue</h3>
        </div>
        <div class="detailsContainer">
          <div className="inputContainer">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            ></input>
          </div>

          <div className="inputContainer">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            ></input>
          </div>
        </div>

        <button className="loginBtn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
