
import { useState } from "react";
import {
  Link,
  useNavigate,
  Routes,
  Route,
} from "react-router-dom";

import {
  Mail,
  Lock,
  ArrowRight,
  Activity,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  LayoutDashboard,
} from "lucide-react";

import axios from "axios";
import Register from "./Register";
import Dashboard from "./components/Dashboard";
import Issues from "./components/Issues";

import "./App.css";

const API = "http://localhost:5000/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, {
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">

        {/* LEFT BRAND PANEL */}
        <section className="auth-visual">
          <div className="visual-top">
            <div className="visual-brand">
              <div className="visual-brand-icon">
                <Activity size={24} />
              </div>
              <span>TrackFlow</span>
            </div>

            <span className="visual-tag">
              ISSUE MANAGEMENT PLATFORM
            </span>
          </div>

          <div className="visual-content">
            <div className="visual-orbit orbit-one"></div>
            <div className="visual-orbit orbit-two"></div>

            <div className="visual-icon-main">
              <LayoutDashboard size={43} />
            </div>

            <h1>Bring your work<br />into focus.</h1>

            <p>
              One workspace to organize issues, collaborate
              with your team and keep every task moving forward.
            </p>

            <div className="visual-features">
              <div>
                <CheckCircle2 size={17} />
                <span>Stay organized</span>
              </div>
              <div>
                <CheckCircle2 size={17} />
                <span>Track progress</span>
              </div>
              <div>
                <CheckCircle2 size={17} />
                <span>Work together</span>
              </div>
            </div>
          </div>

          <div className="visual-footer">
            <ShieldCheck size={16} />
            <span>A smarter way to manage your work.</span>
          </div>
        </section>

        {/* RIGHT LOGIN PANEL */}
        <section className="auth-form-side">
          <div className="auth-form-container">

            <div className="mobile-brand">
              <div className="brand-icon">
                <Activity size={24} />
              </div>
              <span>TrackFlow</span>
            </div>

            <div className="auth-heading">
              <span className="auth-eyebrow">WELCOME BACK</span>
              <h2>Sign in to TrackFlow</h2>
              <p>
                Enter your account details to access your workspace.
              </p>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="auth-form">

              <label htmlFor="login-email">Email address</label>

              <div className="auth-input">
                <Mail size={19} />
                <input
                  id="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <label htmlFor="login-password">Password</label>

              <div className="auth-input">
                <Lock size={19} />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                className="auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in to your account"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="auth-switch">
              Don't have an account?
              <Link to="/register">Create an account</Link>
            </div>

            <div className="auth-security">
              <ShieldCheck size={16} />
              <span>Your workspace is protected by secure authentication.</span>
            </div>

            <p className="auth-copyright">
              © 2026 TrackFlow. All rights reserved.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/issues" element={<Issues />} />
    </Routes>
  );
}

export default App;
