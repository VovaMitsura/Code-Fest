import React, { useState, useEffect } from "react";
import "./Home.css";

const Home = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Set current date
    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(date);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <i
            className={`fas fa-chevron-${sidebarCollapsed ? "right" : "left"}`}
          ></i>
        </button>
        <div className="logo">
          <img src="waveslogo.jpg" alt="Logo" />
        </div>
        <nav>
          <ul>
            <li>
              <a href="index.html" className="active">
                <i className="fas fa-house nav-icon"></i>
                <span className="nav-text">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="productivity.html">
                <i className="fas fa-tasks nav-icon"></i>
                <span className="nav-text">Productivity</span>
              </a>
            </li>
            <li>
              <a href="livelihood.html">
                <i className="fas fa-heart nav-icon"></i>
                <span className="nav-text">Livelihood</span>
              </a>
            </li>
            <li>
              <a href="my-agent.html">
                <i className="fas fa-user nav-icon"></i>
                <span className="nav-text">My Agent</span>
              </a>
            </li>
            <li>
              <a href="health.html">
                <i className="fas fa-heartbeat nav-icon"></i>
                <span className="nav-text">Health</span>
              </a>
            </li>
            <li>
              <a href="report.html">
                <i className="fas fa-file-alt nav-icon"></i>
                <span className="nav-text">Report</span>
              </a>
            </li>
            <li>
              <a href="settings.html">
                <i className="fas fa-gear nav-icon"></i>
                <span className="nav-text">Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h1 style={{ color: "#333333" }}>Dashboard Overview</h1>
          <p className="date" style={{ color: "#666666" }}>
            Today's Date: <span>{currentDate}</span>
          </p>
        </header>

        <section className="dashboard-grid">
          {/* Quick Stats */}
          <div className="card glass-effect">
            <h3 style={{ color: "#055ffc" }}>Daily Progress</h3>
            <div className="progress-circle">
              <span className="percentage" style={{ color: "#055ffc" }}>
                75%
              </span>
            </div>
            <p className="subtext" style={{ color: "#666666" }}>
              Tasks Completed Today
            </p>
          </div>

          {/* Health Summary */}
          <div className="card glass-effect">
            <h3 style={{ color: "#055ffc" }}>Health Status</h3>
            <div className="health-metrics">
              <div className="metric">
                <i
                  className="fas fa-heartbeat"
                  style={{ color: "#055ffc" }}
                ></i>
                <span>72 BPM</span>
              </div>
              <div className="metric">
                <i className="fas fa-walking" style={{ color: "#055ffc" }}></i>
                <span>8,542 steps</span>
              </div>
            </div>
            <p className="subtext" style={{ color: "#666666" }}>
              Today's Health Overview
            </p>
          </div>

          {/* Upcoming Tasks */}
          <div className="card glass-effect">
            <h3 style={{ color: "#055ffc" }}>Priority Tasks</h3>
            <ul className="task-list">
              <li>
                <span className="task-time">09:00</span>
                <span className="task-title">Team Meeting</span>
              </li>
              <li>
                <span className="task-time">11:30</span>
                <span className="task-title">Project Review</span>
              </li>
              <li>
                <span className="task-time">14:00</span>
                <span className="task-title">Client Call</span>
              </li>
            </ul>
          </div>

          {/* Productivity Score */}
          <div className="card glass-effect">
            <h3 style={{ color: "#055ffc" }}>Productivity Score</h3>
            <div className="score-display">
              <span className="large-score" style={{ color: "#055ffc" }}>
                8.5
              </span>
              <span className="score-max">/10</span>
            </div>
            <p className="subtext" style={{ color: "#666666" }}>
              Weekly Average
            </p>
          </div>

          {/* Agent Status */}
          <div className="card glass-effect">
            <h3 style={{ color: "#055ffc" }}>Agent Status</h3>
            <div className="agent-status">
              <i className="fas fa-user" style={{ color: "#055ffc" }}></i>
              <span className="status-text">Active</span>
            </div>
            <p className="subtext" style={{ color: "#666666" }}>
              Last Updated: 5 min ago
            </p>
          </div>

          {/* Quick Actions */}
          <div className="card glass-effect">
            <h3 style={{ color: "#055ffc" }}>Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-btn">
                <i className="fas fa-plus"></i> New Task
              </button>
              <button className="action-btn">
                <i className="fas fa-message"></i> Message
              </button>
              <button className="action-btn">
                <i className="fas fa-chart-line"></i> Reports
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="card glass-effect" style={{ gridColumn: "span 2" }}>
            <div className="notifications-header">
              <h3 style={{ color: "#055ffc" }}>Notifications</h3>
              <div className="notification-actions">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Unread</button>
                <button className="clear-btn">
                  <i className="fas fa-check-double"></i>
                  Mark all as read
                </button>
              </div>
            </div>

            <div className="notifications-container">
              <div className="notification unread">
                <div className="notification-icon health">
                  <i className="fas fa-heartbeat"></i>
                </div>
                <div className="notification-content">
                  <div className="notification-title">
                    <span>Health Alert</span>
                    <span className="notification-time">5 min ago</span>
                  </div>
                  <p>
                    Water intake is below target. Consider drinking more water
                    to meet your daily goal.
                  </p>
                  <div className="notification-meta">
                    <span className="category health">Health</span>
                    <button className="action-btn">View</button>
                  </div>
                </div>
              </div>

              <div className="notification unread">
                <div className="notification-icon productivity">
                  <i className="fas fa-tasks"></i>
                </div>
                <div className="notification-content">
                  <div className="notification-title">
                    <span>Task Due Soon</span>
                    <span className="notification-time">15 min ago</span>
                  </div>
                  <p>
                    Project presentation deadline in 2 hours. All materials are
                    ready for review.
                  </p>
                  <div className="notification-meta">
                    <span className="category productivity">Productivity</span>
                    <button className="action-btn">Review</button>
                  </div>
                </div>
              </div>

              <div className="notification">
                <div className="notification-icon agent">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="notification-content">
                  <div className="notification-title">
                    <span>AI Assistant Update</span>
                    <span className="notification-time">1 hour ago</span>
                  </div>
                  <p>
                    Meeting scheduled with the design team for tomorrow at 10
                    AM.
                  </p>
                  <div className="notification-meta">
                    <span className="category agent">Agent</span>
                    <button className="action-btn">Details</button>
                  </div>
                </div>
              </div>

              <div className="notification">
                <div className="notification-icon livelihood">
                  <i className="fas fa-heart"></i>
                </div>
                <div className="notification-content">
                  <div className="notification-title">
                    <span>Goal Achievement</span>
                    <span className="notification-time">2 hours ago</span>
                  </div>
                  <p>
                    You've completed your weekly meditation goal! Keep up the
                    good work.
                  </p>
                  <div className="notification-meta">
                    <span className="category livelihood">Livelihood</span>
                    <button className="action-btn">View Stats</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
