
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import {
  Activity,
  LayoutDashboard,
  ClipboardList,
  Plus,
  LogOut,
  Search,
  Pencil,
  Trash2,
  X,
  MessageCircle,
  Send,
} from "lucide-react";

import "./Dashboard.css";
import "./Issues.css";

const API = "http://localhost:5000/api";

function Issues() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Comment states
  const [activeCommentIssue, setActiveCommentIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignedTo: "",
  });

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const isAdmin = user.role === "admin";

  const isIssueCreator = (issue) =>
    String(issue.createdBy?._id || issue.createdBy) ===
    String(user._id || user.id);

  const isIssueAssignee = (issue) =>
    String(issue.assignedTo?._id || issue.assignedTo) ===
    String(user._id || user.id);

  // Admin, creator and assigned user can change status.
  const canChangeStatus = (issue) =>
    isAdmin || isIssueCreator(issue) || isIssueAssignee(issue);

  // Only admin and creator can edit or delete.
  const canEditOrDelete = (issue) =>
    isAdmin || isIssueCreator(issue);

  const canComment = (issue) =>
    isAdmin || isIssueCreator(issue) || isIssueAssignee(issue);

  // Priority badge styling
  const getPriorityClass = (priority) => {
    if (priority === "High") return "priority-high";
    if (priority === "Low") return "priority-low";
    return "priority-medium";
  };

  // Status badge styling
  const getStatusClass = (status) => {
    if (status === "Open") return "status-open";
    if (status === "In Progress") return "status-progress";
    if (status === "Closed") return "status-closed";
    return "";
  };

  // FETCH ISSUES
  const fetchIssues = async () => {
    try {
      const response = await axios.get(`${API}/issues`, config);
      setIssues(response.data.issues || []);
    } catch (error) {
      console.error("Issues loading error:", error);

      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  // FETCH USERS FOR ADMIN ASSIGNMENT
  const fetchUsers = async () => {
    if (!isAdmin) return;

    try {
      const response = await axios.get(`${API}/auth/users`, config);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Users loading error:", error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchIssues();
    fetchUsers();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      priority: "Medium",
      assignedTo: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // CREATE OR UPDATE ISSUE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: form.title,
        description: form.description,
        priority: form.priority,
      };

      // Only admins can change issue assignment.
      if (isAdmin) {
        payload.assignedTo = form.assignedTo || null;
      }

      if (editingId) {
        await axios.put(
          `${API}/issues/${editingId}`,
          payload,
          config
        );

        alert("Issue updated successfully!");
      } else {
        await axios.post(
          `${API}/issues`,
          payload,
          config
        );

        alert("Issue created successfully!");
      }

      resetForm();
      await fetchIssues();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to save issue."
      );
    }
  };

  // EDIT ISSUE
  const handleEdit = (issue) => {
    setForm({
      title: issue.title,
      description: issue.description,
      priority: issue.priority || "Medium",
      assignedTo: issue.assignedTo?._id || "",
    });

    setEditingId(issue._id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE ISSUE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) {
      return;
    }

    try {
      await axios.delete(`${API}/issues/${id}`, config);

      if (activeCommentIssue === id) {
        setActiveCommentIssue(null);
        setComments([]);
      }

      alert("Issue deleted successfully!");
      await fetchIssues();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to delete issue."
      );
    }
  };

  // CHANGE ISSUE STATUS
  const handleStatusChange = async (issue, status) => {
    try {
      await axios.put(
        `${API}/issues/${issue._id}`,
        { status },
        config
      );

      alert("Issue status updated successfully!");
      await fetchIssues();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to update status."
      );

      await fetchIssues();
    }
  };

  // LOAD COMMENTS
  const openComments = async (issue) => {
    if (activeCommentIssue === issue._id) {
      setActiveCommentIssue(null);
      setComments([]);
      setCommentText("");
      return;
    }

    setActiveCommentIssue(issue._id);
    setComments([]);
    setCommentText("");
    setCommentsLoading(true);

    try {
      const response = await axios.get(
        `${API}/comments/${issue._id}`,
        config
      );

      setComments(response.data.comments || []);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to load comments."
      );
    } finally {
      setCommentsLoading(false);
    }
  };

  // ADD COMMENT
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim() || !activeCommentIssue) return;

    setCommentSubmitting(true);

    try {
      const response = await axios.post(
        `${API}/comments/${activeCommentIssue}`,
        { text: commentText.trim() },
        config
      );

      setComments((previous) => [
        ...previous,
        response.data.comment,
      ]);

      setCommentText("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to add comment."
      );
    } finally {
      setCommentSubmitting(false);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // SEARCH ISSUES
  const filteredIssues = issues.filter((issue) =>
    issue.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout issues-page">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Activity size={25} />
          <h2>TrackFlow</h2>
        </div>

        <p className="menu-heading">WORKSPACE</p>

        <Link to="/dashboard" className="sidebar-link">
          <LayoutDashboard size={19} />
          Dashboard
        </Link>

        <Link to="/issues" className="sidebar-link active">
          <ClipboardList size={19} />
          All Issues
        </Link>

        <button className="sidebar-logout" onClick={logout}>
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <h2>Issue Management</h2>
            <p>Create, monitor and manage your issues.</p>
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

          {/* PAGE HEADER */}
          <div className="recent-header">
            <div>
              <h3>All Issues ({issues.length})</h3>
              <p>Manage, assign and track your team's work.</p>
            </div>

            <button
              className="create-issue-button"
              onClick={() => {
                resetForm();
                setShowForm(true);

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              <Plus size={18} />
              Create Issue
            </button>
          </div>

          {/* SEARCH */}
          <div className="search-box">
            <Search size={19} />

            <input
              placeholder="Search issues by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* CREATE / EDIT FORM */}
          {showForm && (
            <div className="issue-form-card">
              <div className="form-header">
                <div>
                  <h3>
                    {editingId ? "Edit Issue" : "Create New Issue"}
                  </h3>
                  <p>
                    {editingId
                      ? "Update the issue details below."
                      : "Fill in the details to create a new issue."}
                  </p>
                </div>

                <button
                  onClick={resetForm}
                  className="close-button"
                  type="button"
                  title="Close form"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <label>Issue Title</label>

                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter a clear issue title"
                  required
                />

                <label>Description</label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the issue and what needs to be done..."
                  rows="4"
                  required
                />

                <label>Priority</label>

                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>

                {isAdmin && (
                  <>
                    <label>Assign To</label>

                    <select
                      value={form.assignedTo}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          assignedTo: e.target.value,
                        })
                      }
                    >
                      <option value="">Unassigned</option>

                      {users
                        .filter((u) => u.role !== "admin")
                        .map((u) => (
                          <option key={u._id} value={u._id}>
                            {u.name} ({u.email})
                          </option>
                        ))}
                    </select>
                  </>
                )}

                <button
                  type="submit"
                  className="login-button"
                >
                  {editingId ? "Update Issue" : "Create Issue"}
                </button>
              </form>
            </div>
          )}

          {/* ISSUES TABLE */}
          <div className="issues-table">
            <div className="table-heading">
              <span>Issue Title</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Assigned To</span>
              <span>Actions</span>
            </div>

            {loading ? (
              <p className="empty-state">Loading issues...</p>
            ) : filteredIssues.length === 0 ? (
              <p className="empty-state">
                No issues found. Try another search or create an issue.
              </p>
            ) : (
              filteredIssues.map((issue) => (
                <div key={issue._id} className="issue-entry">

                  <div className="table-row issue-row">

                    {/* TITLE */}
                    <span className="issue-title-cell">
                      <span className="issue-table-icon">
                        <ClipboardList size={16} />
                      </span>
                      <strong>{issue.title}</strong>
                    </span>

                    {/* PRIORITY */}
                    <span>
                      <span
                        className={`priority-badge ${getPriorityClass(
                          issue.priority || "Medium"
                        )}`}
                      >
                        {issue.priority || "Medium"}
                      </span>
                    </span>

                    {/* STATUS */}
                    <span className="status-cell">
                      <span
                        className={`status-indicator ${getStatusClass(issue.status)}`}
                      >
                        <span className="status-dot"></span>
                        {issue.status}
                      </span>

                      <select
                        className="status-select"
                        value={issue.status}
                        onChange={(e) =>
                          handleStatusChange(issue, e.target.value)
                        }
                        disabled={!canChangeStatus(issue)}
                        title={
                          canChangeStatus(issue)
                            ? "Change issue status"
                            : "You cannot change this issue's status"
                        }
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </span>

                    {/* ASSIGNED USER */}
                    <span className="assigned-user-cell">
                      {issue.assignedTo?.name || "Unassigned"}
                    </span>

                    {/* ACTIONS */}
                    <span className="issue-actions">
                      {canEditOrDelete(issue) && (
                        <>
                          <button
                            onClick={() => handleEdit(issue)}
                            title="Edit issue"
                            type="button"
                            className="action-edit"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(issue._id)}
                            title="Delete issue"
                            type="button"
                            className="action-delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}

                      {!canEditOrDelete(issue) && (
                        <span className="no-action">—</span>
                      )}

                      {canComment(issue) && (
                        <button
                          onClick={() => openComments(issue)}
                          title="View comments"
                          type="button"
                          className="action-comment"
                        >
                          <MessageCircle size={16} />
                        </button>
                      )}
                    </span>
                  </div>

                  {/* COMMENTS */}
                  {activeCommentIssue === issue._id && (
                    <div className="comments-panel">
                      <h4>Comments — {issue.title}</h4>

                      {commentsLoading ? (
                        <p className="empty-comments">
                          Loading comments...
                        </p>
                      ) : comments.length === 0 ? (
                        <p className="empty-comments">
                          No comments yet. Start the conversation!
                        </p>
                      ) : (
                        <div className="comments-list">
                          {comments.map((comment) => (
                            <div
                              className="comment-item"
                              key={comment._id}
                            >
                              <strong>
                                {comment.user?.name || "User"}
                              </strong>

                              <p>{comment.text}</p>

                              <small>
                                {comment.createdAt
                                  ? new Date(
                                      comment.createdAt
                                    ).toLocaleString()
                                  : ""}
                              </small>
                            </div>
                          ))}
                        </div>
                      )}

                      <form
                        className="comment-form"
                        onSubmit={handleAddComment}
                      >
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentText}
                          onChange={(e) =>
                            setCommentText(e.target.value)
                          }
                          required
                        />

                        <button
                          type="submit"
                          disabled={
                            commentSubmitting || !commentText.trim()
                          }
                        >
                          <Send size={16} />
                          {commentSubmitting ? "Sending..." : "Send"}
                        </button>
                      </form>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>

        </section>
      </main>
    </div>
  );
}

export default Issues;
