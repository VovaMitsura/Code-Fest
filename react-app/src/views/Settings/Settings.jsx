import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Sidebar from '../../components/Sidebar/Sidebar';
import "./Settings.css";

const Settings = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const navigate = useNavigate();
    
    // Sample settings
    const [settings, setSettings] = useState({
        darkMode: false,
        notifications: true,
        soundAlerts: false,
        fontSize: 'medium',
        language: 'english',
        autoSave: true
    });

    useEffect(() => {
        const date = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        setCurrentDate(date);
    }, []);

    useEffect(() => {
        const time = new Date().toLocaleTimeString('en-US');
        setCurrentTime(time);
    }, []);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const handleNavigation = (page) => {
        if (page === 'dashboard') {
            navigate('/dashboard');
        } else {
            navigate(`/${page}`);
        }
    };

    const updateSetting = (setting, value) => {
        setSettings({
            ...settings,
            [setting]: value
        });
    };

    return (
        <div className="dashboard-container">
            <Sidebar 
                sidebarCollapsed={sidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
            />
            
            <main className="main-content">
                <div className="dashboard-content">
                    <div className="welcome-banner">
                        <div className="welcome-content">
                            <h1>Settings</h1>
                            <p className="date-display">{currentDate}</p>
                            <p className="time-display">{currentTime}</p>
                        </div>
                    </div>
                    
                    <div className="settings-section">
                        <div className="settings-grid">
                            <div className="settings-card">
                                <h3>Account Settings</h3>
                                <div className="settings-list">
                                    <div className="settings-item">
                                        <div className="settings-item-label">Profile Information</div>
                                        <button className="settings-edit-btn">Edit</button>
                                    </div>
                                    <div className="settings-item">
                                        <div className="settings-item-label">Change Password</div>
                                        <button className="settings-edit-btn">Edit</button>
                                    </div>
                                    <div className="settings-item">
                                        <div className="settings-item-label">Email Preferences</div>
                                        <button className="settings-edit-btn">Edit</button>
                                    </div>
                                    <div className="settings-item">
                                        <div className="settings-item-label">Connected Accounts</div>
                                        <button className="settings-edit-btn">Manage</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="settings-card">
                                <h3>Appearance</h3>
                                <div className="settings-list">
                                    <div className="settings-item">
                                        <div className="settings-item-label">Dark Mode</div>
                                        <div className="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                id="darkMode" 
                                                className="toggle-input" 
                                                checked={settings.darkMode}
                                                onChange={(e) => updateSetting('darkMode', e.target.checked)}
                                            />
                                            <label htmlFor="darkMode" className="toggle-label"></label>
                                        </div>
                                    </div>
                                    <div className="settings-item">
                                        <div className="settings-item-label">Font Size</div>
                                        <select 
                                            className="settings-select"
                                            value={settings.fontSize}
                                            onChange={(e) => updateSetting('fontSize', e.target.value)}
                                        >
                                            <option value="small">Small</option>
                                            <option value="medium">Medium</option>
                                            <option value="large">Large</option>
                                        </select>
                                    </div>
                                    <div className="settings-item">
                                        <div className="settings-item-label">Language</div>
                                        <select 
                                            className="settings-select"
                                            value={settings.language}
                                            onChange={(e) => updateSetting('language', e.target.value)}
                                        >
                                            <option value="english">English</option>
                                            <option value="spanish">Spanish</option>
                                            <option value="french">French</option>
                                            <option value="german">German</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="settings-card">
                                <h3>Notifications</h3>
                                <div className="settings-list">
                                    <div className="settings-item">
                                        <div className="settings-item-label">Push Notifications</div>
                                        <div className="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                id="pushNotifications" 
                                                className="toggle-input" 
                                                checked={settings.notifications}
                                                onChange={(e) => updateSetting('notifications', e.target.checked)}
                                            />
                                            <label htmlFor="pushNotifications" className="toggle-label"></label>
                                        </div>
                                    </div>
                                    <div className="settings-item">
                                        <div className="settings-item-label">Email Notifications</div>
                                        <div className="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                id="emailNotifications" 
                                                className="toggle-input" 
                                                defaultChecked 
                                            />
                                            <label htmlFor="emailNotifications" className="toggle-label"></label>
                                        </div>
                                    </div>
                                    <div className="settings-item">
                                        <div className="settings-item-label">Sound Alerts</div>
                                        <div className="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                id="soundAlerts" 
                                                className="toggle-input" 
                                                checked={settings.soundAlerts}
                                                onChange={(e) => updateSetting('soundAlerts', e.target.checked)}
                                            />
                                            <label htmlFor="soundAlerts" className="toggle-label"></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="settings-card">
                                <h3>Privacy & Security</h3>
                                <div className="settings-list">
                                    <div className="settings-item">
                                        <div className="settings-item-label">Two-Factor Authentication</div>
                                        <button className="settings-edit-btn">Setup</button>
                                    </div>
                                    <div className="settings-item">
                                        <div className="settings-item-label">Data Sharing</div>
                                        <button className="settings-edit-btn">Manage</button>
                                    </div>
                                    <div className="settings-item">
                                        <div className="settings-item-label">Auto-Save</div>
                                        <div className="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                id="autoSave" 
                                                className="toggle-input" 
                                                checked={settings.autoSave}
                                                onChange={(e) => updateSetting('autoSave', e.target.checked)}
                                            />
                                            <label htmlFor="autoSave" className="toggle-label"></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="settings-actions">
                            <button className="settings-save-btn">Save Changes</button>
                            <button className="settings-reset-btn">Reset to Default</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings; 