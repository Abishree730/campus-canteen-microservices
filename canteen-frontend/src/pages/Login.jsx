import { useState } from "react";
import { loginUser } from "../services/userService";

function Login({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await loginUser({
        email,
        password,
      });

      // Create the logged-in user object
      const user = {
        userId: response.userId,
        name: response.name,
        role: response.role,
      };

      // Save user information
      localStorage.setItem(
        "canteenUser",
        JSON.stringify(user)
      );

      // Send user information to App.jsx
      onLogin(user);

    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
        "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* ICON */}
        <div className="login-icon">
          🍴
        </div>

        {/* TITLE */}
        <h1>
          Welcome Back
        </h1>

        <p>
          Login to your canteen account
        </p>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin}>

          {/* EMAIL */}
          <label>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />

          {/* PASSWORD */}
          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />

          {/* ERROR MESSAGE */}
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* REGISTER BUTTON */}
        <button
          type="button"
          className="secondary-button"
          onClick={onGoToRegister}
        >
          Don't have an account? Register
        </button>

      </div>

    </div>
  );
}

export default Login;