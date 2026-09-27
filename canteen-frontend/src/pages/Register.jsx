import { useState } from "react";
import { registerUser } from "../services/userService";

function Register({ onRegisterSuccess, onGoToLogin }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  const handleRegister = async (event) => {

    event.preventDefault();

    try {

      setLoading(true);
      setError("");
      setSuccess("");

      const response = await registerUser({
        name,
        email,
        password,
        role: "USER",
      });

      console.log("Registration successful:", response);

      setSuccess(
        "Registration successful! You can now login."
      );

      setName("");
      setEmail("");
      setPassword("");

      if (onRegisterSuccess) {
        onRegisterSuccess();
      }

    } catch (error) {

      console.error("Registration error:", error);

      if (error.response?.data?.message) {

        setError(error.response.data.message);

      } else {

        setError(
          "Registration failed. Please try again."
        );

      }

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="login-page">

      <div className="login-card">

        <div className="login-icon">
          🍴
        </div>

        <h1>Create Account</h1>

        <p>
          Register for your canteen account
        </p>


        <form onSubmit={handleRegister}>

          <label>
            Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />


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


          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />


          {error && (

            <div className="login-error">
              {error}
            </div>

          )}


          {success && (

            <div className="register-success">
              {success}
            </div>

          )}


          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >

            {loading
              ? "Creating Account..."
              : "Register"}

          </button>

        </form>


        <button
          className="secondary-button"
          onClick={onGoToLogin}
        >
          Already have an account? Login
        </button>

      </div>

    </div>

  );
}

export default Register;