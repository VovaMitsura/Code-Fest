import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Sidebar from '../../components/Sidebar/Sidebar';
import "./Dashboard.css";

const Dashboard = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const navigate = useNavigate();

    // Sample data for dashboard
    const tasks = [
        { id: 1, text: "Complete project proposal", completed: false },
        { id: 2, text: "Review team's progress", completed: false },
        { id: 3, text: "Schedule client meeting", completed: true },
        { id: 4, text: "Update documentation", completed: false }
    ];

    const healthMetrics = {
        steps: 7842,
        water: 5,
        sleep: 7.5,
        meditation: 15
    };

    useEffect(() => {
        // Update date once
        updateDateTime();
        
        // Update time every second
        const timeInterval = setInterval(() => {
            updateDateTime();
        }, 1000);
        
        // Clean up interval on component unmount
        return () => clearInterval(timeInterval);
    }, []);
    
    const updateDateTime = () => {
        const now = new Date();
        
        // Format date as "Sunday, March 2, 2025"
        const formattedDate = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        
        // Format time as "HH:MM:SS AM/PM"
        const formattedTime = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        
        setCurrentDate(formattedDate);
        setCurrentTime(formattedTime);
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const handleNavigation = (page) => {
        navigate(`/${page}`);
    };

    return (
        <div className="dashboard-container">
            {/* Use the shared Sidebar component */}
            <Sidebar 
                sidebarCollapsed={sidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
            />

            {/* Main Content Area */}
            <main className="main-content">
                <header className="content-header">
                    <h1>Dashboard</h1>
                    <p className="date-display">{currentDate}</p>
                </header>

                <div className="dashboard-content">
                    <div className="welcome-banner">
                        <div className="welcome-content">
                            <h1>Dashboard</h1>
                            <p className="date-display">{currentDate}</p>
                            <p className="time-display">{currentTime}</p>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        {/* Tasks Overview */}
                        <div className="dashboard-card tasks-overview">
                            <div className="card-header">
                                <h3>
                                    <span className="card-icon">📋</span> 
                                    Tasks Overview
                                </h3>
                                <button onClick={() => handleNavigation('tasks')} className="view-all-link">View All</button>
                            </div>
                            <div className="card-content">
                                <div className="task-stats">
                                    <div className="stat-item">
                                        <div className="stat-value">{tasks.length}</div>
                                        <div className="stat-label">Total Tasks</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{tasks.filter(task => !task.completed).length}</div>
                                        <div className="stat-label">In Progress</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{tasks.filter(task => task.completed).length}</div>
                                        <div className="stat-label">Completed</div>
                                    </div>
                                </div>
                                <div className="recent-tasks">
                                    {tasks.slice(0, 3).map(task => (
                                        <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                            <div className={`task-checkbox ${task.completed ? 'checked' : ''}`}>
                                                {task.completed && <div className="checkbox-inner">✓</div>}
                                            </div>
                                            <span className="task-text">{task.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Health Overview */}
                        <div className="dashboard-card health-overview">
                            <div className="card-header">
                                <h3>
                                    <span className="card-icon">❤️</span> 
                                    Health Overview
                                </h3>
                                <button onClick={() => handleNavigation('health')} className="view-all-link">View All</button>
                            </div>
                            <div className="card-content">
                                <div className="health-stats">
                                    <div className="health-stat-item">
                                        <div className="health-stat-icon">👣</div>
                                        <div className="health-stat-info">
                                            <span className="health-stat-value">{healthMetrics.steps}</span>
                                            <span className="health-stat-label">Steps</span>
                                        </div>
                                        <div className="health-stat-progress">
                                            <div className="progress-bar" style={{ width: `${Math.min(healthMetrics.steps / 10000 * 100, 100)}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="health-stat-item">
                                        <div className="health-stat-icon">💧</div>
                                        <div className="health-stat-info">
                                            <span className="health-stat-value">{healthMetrics.water}</span>
                                            <span className="health-stat-label">Glasses of Water</span>
                                        </div>
                                        <div className="health-stat-progress">
                                            <div className="progress-bar" style={{ width: `${Math.min(healthMetrics.water / 8 * 100, 100)}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Overview */}
                        <div className="dashboard-card calendar-overview">
                            <div className="card-header">
                                <h3>
                                    <span className="card-icon">📅</span> 
                                    Today's Schedule
                                </h3>
                            </div>
                            <div className="card-content">
                                <div className="schedule-list">
                                    <div className="schedule-item">
                                        <div className="schedule-time">9:00 AM</div>
                                        <div className="schedule-details">
                                            <div className="schedule-title">Team Stand-up</div>
                                            <div className="schedule-location">Meeting Room A</div>
                                        </div>
                                    </div>
                                    <div className="schedule-item">
                                        <div className="schedule-time">11:30 AM</div>
                                        <div className="schedule-details">
                                            <div className="schedule-title">Project Review</div>
                                            <div className="schedule-location">Conference Room</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings Overview */}
                        <div className="dashboard-card settings-overview">
                            <div className="card-header">
                                <h3>
                                    <span className="card-icon">⚙️</span> 
                                    Quick Settings
                                </h3>
                                <button onClick={() => handleNavigation('settings')} className="view-all-link">All Settings</button>
                            </div>
                            <div className="card-content">
                                <div className="quick-settings">
                                    <div className="setting-item">
                                        <div className="setting-label">Dark Mode</div>
                                        <div className="toggle-switch">
                                            <input type="checkbox" id="darkMode" className="toggle-input" />
                                            <label htmlFor="darkMode" className="toggle-label"></label>
                                        </div>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-label">Notifications</div>
                                        <div className="toggle-switch">
                                            <input type="checkbox" id="notifications" className="toggle-input" defaultChecked />
                                            <label htmlFor="notifications" className="toggle-label"></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;