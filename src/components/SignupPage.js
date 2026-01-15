import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

function SignupPage({ showToast }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password) {
      setError("Username, email, and password are required");
      return;
    }

    try {
      setLoading(true);
      await AuthService.signup({ username, email, password });
      showToast?.("Account created successfully");
      navigate("/", { replace: true });
    } catch (e2) {
      const msg =
        e2?.response?.data?.message ||
        e2?.response?.data ||
        e2?.message ||
        "Signup failed";
      setError(String(msg));
      showToast?.(String(msg), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <h3 className="mb-3">Signup</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>

        <div className="mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default SignupPage;
