import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Activity,
  LayoutDashboard,
  ClipboardList,
  Plus,
  LogOut,
  Circle,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
  ListTodo,
  Sparkles,
} from "lucide-react";
import "./Dashboard.css";

const API = "http://localhost:5000/api";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  });

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const [statsResponse, issuesResponse] = await Promise.all([
        axios.get(`${API}/dashboard/stats`, config),
        axios.get(`${API}/issues`, config),
      ]);

      setStats(statsResponse.data.stats || {
        total: 0,
        open: 0,
        inProgress: 0,
        closed: 0,
      });

      setIssues(issuesResponse.data.issues || []);
    } catch (error) {
      console.error("Dashboard error:", error);

      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const total = Number(stats.total) || 0;
  const open = Number(stats.open) || 0;
  const inProgress = Number(stats.inProgress) || 0;
  const closed = Number(stats.closed) || 0;

  const percentage = (value) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  const cards = [
    {
      title: "Total Issues",
      value: total,
      icon: ClipboardList,
      color: "purple",
      note: "All tracked issues",
    },
    {
      title: "Open Issues",
      value: open,
      icon: Circle,
      color: "orange",
      note: "Waiting to start",
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: Clock,
      color: "blue",
      note: "Currently active",
    },
    {
      title: "Closed Issues",
      value: closed,
      icon: CheckCircle,
      color: "green",
      note: "Successfully completed",
    },
  ];

  const getStatusClass = (status) => {
    if (status === "Open") return "status-open";
    if (status === "In Progress") return "status-progress";
    if (status === "Closed") return "status-closed";
    return "";
  };

  const getPriorityClass = (priority) => {
    if (priority === "High") return "priority-high";
    if (priority === "Low") return "priority-low";
    return "priority-medium";
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Activity size={24} />
          </div>
          <h2>TrackFlow</h2>
        </div>

        <p className="menu-heading">WORKSPACE</p>

        <Link to="/dashboard" className="sidebar-link active">
          <LayoutDashboard size={19} />
          Dashboard
        </Link>

        <Link to="/issues" className="sidebar-link">
          <ClipboardList size={19} />
          All Issues
        </Link>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <strong>{user.name || "User"}</strong>
              <span>{user.role || "user"}</span>
            </div>
          </div>

          <button className="sidebar-logout" onClick={logout}>
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <div className="topbar-label">WORKSPACE OVERVIEW</div>
            <h2>Dashboard</h2>
            <p>Welcome back, {user.name || "User"}! Here's your activity overview.</p>
          </div>

          <div className="profile">
            <div className="avatar">
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{user.name || "User"}</strong>
              <span>{user.role || "user"}</span>
            </div>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="welcome-banner">
            <div className="banner-content">
              <div className="banner-tag">
                <Sparkles size={14} />
                YOUR WORKSPACE
              </div>

              <h1>Stay organized. Get things done.</h1>
              <p>
                Track issues, manage priorities and keep your work moving
                forward with TrackFlow.
              </p>

              <button onClick={() => navigate("/issues")}>
                <Plus size={18} />
                Create Issue
              </button>
            </div>

            <div className="banner-decoration">
              <div className="decoration-circle circle-one"></div>
              <div className="decoration-circle circle-two"></div>
              <div className="decoration-card">
                <TrendingUp size={30} />
                <strong>Track your progress</strong>
                <span>One issue at a time</span>
              </div>
            </div>
          </div>

          <div className="section-heading">
            <div>
              <h3>Overview</h3>
              <p>A quick look at your issue activity</p>
            </div>
            <div className="overview-label">
              <Activity size={15} />
              Live overview
            </div>
          </div>

          <div className="stats-grid">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div className="stat-card" key={card.title}>
                  <div className="stat-card-top">
                    <div className={`stat-icon ${card.color}`}>
                      <Icon size={22} />
                    </div>
                    <span className="stat-card-arrow">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>

                  <p className="stat-title">{card.title}</p>
                  <h2>{loading ? "..." : card.value}</h2>
                  <span className="stat-note">{card.note}</span>
                </div>
              );
            })}
          </div>

          <div className="dashboard-lower-grid">
            <div className="status-overview">
              <div className="panel-heading">
                <div>
                  <h3>Issue Status</h3>
                  <p>Distribution of your issues</p>
                </div>
                <div className="panel-icon">
                  <ListTodo size={19} />
                </div>
              </div>

              <div className="status-total">
                <strong>{loading ? "..." : total}</strong>
                <span>Total issues</span>
              </div>

              <div className="status-progress-bar">
                <div
                  className="progress-segment open-segment"
                  style={{ width: `${percentage(open)}%` }}
                ></div>
                <div
                  className="progress-segment progress-segment-blue"
                  style={{ width: `${percentage(inProgress)}%` }}
                ></div>
                <div
                  className="progress-segment closed-segment"
                  style={{ width: `${percentage(closed)}%` }}
                ></div>
              </div>

              <div className="status-legend">
                <div>
                  <span className="legend-dot open-dot"></span>
                  <span>Open</span>
                  <strong>{loading ? "..." : open}</strong>
                </div>
                <div>
                  <span className="legend-dot progress-dot"></span>
                  <span>In Progress</span>
                  <strong>{loading ? "..." : inProgress}</strong>
                </div>
                <div>
                  <span className="legend-dot closed-dot"></span>
                  <span>Closed</span>
                  <strong>{loading ? "..." : closed}</strong>
                </div>
              </div>
            </div>

            <div className="quick-action-card">
              <div className="quick-action-icon">
                <ClipboardList size={23} />
              </div>
              <h3>Keep your work moving</h3>
              <p>
                Create a new issue, assign responsibility and track its
                progress from one place.
              </p>
              <Link to="/issues">
                Go to All Issues
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>

          <div className="recent-section">
            <div className="recent-header">
              <div>
                <h3>Recent Issues</h3>
                <p>Your latest tracked work</p>
              </div>

              <Link to="/issues" className="view-all-link">
                View all issues
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="issues-table">
              <div className="table-heading">
                <span>Issue Title</span>
                <span>Priority</span>
                <span>Status</span>
                <span>Created By</span>
              </div>

              {loading ? (
                <p className="empty-state">Loading issues...</p>
              ) : issues.length === 0 ? (
                <div className="empty-state">
                  <ClipboardList size={30} />
                  <strong>No issues yet</strong>
                  <span>Create your first issue to get started.</span>
                </div>
              ) : (
                issues.slice(0, 5).map((issue) => (
                  <div className="table-row" key={issue._id}>
                    <div className="issue-title-cell">
                      <span className="issue-table-icon">
                        <ClipboardList size={16} />
                      </span>
                      <strong>{issue.title}</strong>
                    </div>

                    <span>
                      <span
                        className={`priority-badge ${getPriorityClass(
                          issue.priority || "Medium"
                        )}`}
                      >
                        {issue.priority || "Medium"}
                      </span>
                    </span>

                    <span>
                      <span
                        className={`status-badge ${getStatusClass(issue.status)}`}
                      >
                        {issue.status}
                      </span>
                    </span>

                    <span className="created-by-cell">
                      {issue.createdBy?.name || "Unknown"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <footer className="dashboard-footer">
            <span>TrackFlow</span>
            <span>Issue tracking made simple.</span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;