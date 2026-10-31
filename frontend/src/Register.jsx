
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Activity,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import axios from "axios";

const API = "https://trackflow-issue-tracker.onrender.com/api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const getPasswordStrength = (password) => {
    if (!password) return 0;

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const strength = getPasswordStrength(form.password);

  const strengthLabel = [
    "",
    "Very weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
  ][strength];

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match. Please check again.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API}/auth/register`,
        {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
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
              <User size={43} />
            </div>

            <h1>Make progress<br />together.</h1>

            <p>
              Create your workspace, collaborate with your
              team and turn everyday tasks into meaningful progress.
            </p>

            <div className="visual-features">
              <div>
                <CheckCircle2 size={17} />
                <span>Simple issue management</span>
              </div>
              <div>
                <CheckCircle2 size={17} />
                <span>Team collaboration</span>
              </div>
              <div>
                <CheckCircle2 size={17} />
                <span>Progress tracking</span>
              </div>
            </div>
          </div>

          <div className="visual-footer">
            <ShieldCheck size={16} />
            <span>Get started with TrackFlow today.</span>
          </div>
        </section>

        {/* RIGHT REGISTRATION PANEL */}
        <section className="auth-form-side">
          <div className="auth-form-container">

            <div className="mobile-brand">
              <div className="brand-icon">
                <Activity size={24} />
              </div>
              <span>TrackFlow</span>
            </div>

            <div className="auth-heading">
              <span className="auth-eyebrow">GET STARTED</span>
              <h2>Create your account</h2>
              <p>
                Join TrackFlow and start managing your work.
              </p>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="auth-form">

              <label htmlFor="register-name">Full name</label>

              <div className="auth-input">
                <User size={19} />
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

              <label htmlFor="register-email">Email address</label>

              <div className="auth-input">
                <Mail size={19} />
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <label htmlFor="register-password">Password</label>

              <div className="auth-input">
                <Lock size={19} />
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
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

              {form.password && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <span
                        key={level}
                        className={level <= strength ? `strength-filled strength-${strength}` : ""}
                      />
                    ))}
                  </div>
                  <span>
                    Password strength: <strong>{strengthLabel}</strong>
                  </span>
                </div>
              )}

              <label htmlFor="confirm-password">Confirm password</label>

              <div className="auth-input">
                <Lock size={19} />
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {form.confirmPassword && (
                <p className={`password-match ${
                  form.password === form.confirmPassword
                    ? "match-success"
                    : "match-error"
                }`}>
                  {form.password === form.confirmPassword
                    ? "Passwords match"
                    : "Passwords do not match"}
                </p>
              )}

              <button
                className="auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create your account"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="auth-switch">
              Already have an account?
              <Link to="/">Sign in</Link>
            </div>

            <div className="auth-security">
              <ShieldCheck size={16} />
              <span>Your account details are securely protected.</span>
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

export default Register;
