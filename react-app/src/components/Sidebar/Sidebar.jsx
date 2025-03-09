import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import './Sidebar.css';

const Sidebar = ({ sidebarCollapsed, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleNavigation = (page) => {
        navigate(`/${page}`);
    };
    
    const isActive = (path) => {
        return location.pathname === `/${path}`;
    };
    
    return (
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <div className="logo-container">
                <span className="logo-text">TrueTide</span>
            </div>
            
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                {sidebarCollapsed ? '→' : '←'}
            </button>
            
            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <button 
                            className={`nav-link ${isActive('dashboard') ? 'active' : ''}`}
                            onClick={() => handleNavigation('dashboard')}
                        >
                            <i className="nav-icon">🏠</i>
                            <span className={`nav-text ${sidebarCollapsed ? 'hidden' : ''}`}>Dashboard</span>
                        </button>
                    </li>
                    <li>
                        <button 
                            className={`nav-link ${isActive('tasks') ? 'active' : ''}`}
                            onClick={() => handleNavigation('tasks')}
                        >
                            <i className="nav-icon">📋</i>
                            <span className={`nav-text ${sidebarCollapsed ? 'hidden' : ''}`}>Tasks</span>
                        </button>
                    </li>
                    <li>
                        <button 
                            className={`nav-link ${isActive('health') ? 'active' : ''}`}
                            onClick={() => handleNavigation('health')}
                        >
                            <i className="nav-icon">❤️</i>
                            <span className={`nav-text ${sidebarCollapsed ? 'hidden' : ''}`}>Health</span>
                        </button>
                    </li>
                    <li>
                        <button 
                            className={`nav-link ${isActive('settings') ? 'active' : ''}`}
                            onClick={() => handleNavigation('settings')}
                        >
                            <i className="nav-icon">⚙️</i>
                            <span className={`nav-text ${sidebarCollapsed ? 'hidden' : ''}`}>Settings</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar; 