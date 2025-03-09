import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Sidebar from '../../components/Sidebar/Sidebar';
import "./Health.css";

export default function Health(){
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const navigate = useNavigate();
    
    // Sample health data
    const [healthMetrics, setHealthMetrics] = useState({
        steps: 7842,
        water: 5,
        sleep: 7.5,
        meditation: 15,
        heartRate: 72,
        calories: 1850
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

    const updateMetric = (metric, value) => {
        setHealthMetrics({
            ...healthMetrics,
            [metric]: value
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
                            <h1>Health</h1>
                            <p className="date-display">{currentDate}</p>
                            <p className="time-display">{currentTime}</p>
                        </div>
                    </div>
                    
                    <div className="health-section">
                        <div className="health-summary">
                            <div className="health-summary-card">
                                <div className="summary-icon">👣</div>
                                <div className="summary-value">{healthMetrics.steps}</div>
                                <div className="summary-label">Steps</div>
                                <div className="summary-progress">
                                    <div className="summary-progress-bar" style={{ width: `${Math.min(healthMetrics.steps / 10000 * 100, 100)}%` }}></div>
                                </div>
                                <div className="summary-target">Target: 10,000</div>
                                <div className="summary-controls">
                                    <button 
                                        className="control-btn" 
                                        onClick={() => updateMetric('steps', Math.max(0, healthMetrics.steps - 1000))}
                                    >
                                        -
                                    </button>
                                    <button 
                                        className="control-btn" 
                                        onClick={() => updateMetric('steps', healthMetrics.steps + 1000)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            
                            <div className="health-summary-card">
                                <div className="summary-icon">💧</div>
                                <div className="summary-value">{healthMetrics.water}</div>
                                <div className="summary-label">Glasses of Water</div>
                                <div className="summary-progress">
                                    <div className="summary-progress-bar" style={{ width: `${Math.min(healthMetrics.water / 8 * 100, 100)}%` }}></div>
                                </div>
                                <div className="summary-target">Target: 8 glasses</div>
                                <div className="summary-controls">
                                    <button 
                                        className="control-btn" 
                                        onClick={() => updateMetric('water', Math.max(0, healthMetrics.water - 1))}
                                    >
                                        -
                                    </button>
                                    <button 
                                        className="control-btn" 
                                        onClick={() => updateMetric('water', healthMetrics.water + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            
                            <div className="health-summary-card">
                                <div className="summary-icon">😴</div>
                                <div className="summary-value">{healthMetrics.sleep}h</div>
                                <div className="summary-label">Sleep</div>
                                <div className="summary-progress">
                                    <div className="summary-progress-bar" style={{ width: `${Math.min(healthMetrics.sleep / 8 * 100, 100)}%` }}></div>
                                </div>
                                <div className="summary-target">Target: 8 hours</div>
                                <div className="summary-controls">
                                    <button 
                                        className="control-btn" 
                                        onClick={() => updateMetric('sleep', Math.max(0, healthMetrics.sleep - 0.5))}
                                    >
                                        -
                                    </button>
                                    <button 
                                        className="control-btn" 
                                        onClick={() => updateMetric('sleep', Math.min(12, healthMetrics.sleep + 0.5))}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            
                            <div className="health-summary-card">
                                <div className="summary-icon">🧘</div>
                                <div className="summary-value">{healthMetrics.meditation}m</div>
                                <div className="summary-label">Meditation</div>
                                <div className="summary-progress">
                                    <div className="summary-progress-bar" style={{ width: `${Math.min(healthMetrics.meditation / 20 * 100, 100)}%` }}></div>
                                </div>
                                <div className="summary-target">Target: 20 minutes</div>
                                <div className="summary-controls">
                                    <button 
                                        className="control-btn" 
                                        onClick={() => updateMetric('meditation', Math.max(0, healthMetrics.meditation - 5))}
                                    >
                                        -
                                    </button>
                                    <button 
                                        className="control-btn" 
                                        onClick={() => updateMetric('meditation', healthMetrics.meditation + 5)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="health-details">
                            <div className="health-card">
                                <h3>Health Tips</h3>
                                <div className="health-tips-list">
                                    <div className="health-tip">
                                        <div className="tip-icon">💡</div>
                                        <div className="tip-content">
                                            <h4>Stay Hydrated</h4>
                                            <p>Try to drink a glass of water every hour to reach your daily goal.</p>
                                        </div>
                                    </div>
                                    <div className="health-tip">
                                        <div className="tip-icon">💡</div>
                                        <div className="tip-content">
                                            <h4>Take Walking Breaks</h4>
                                            <p>A 5-minute walk every hour can help you reach your step goal and improve focus.</p>
                                        </div>
                                    </div>
                                    <div className="health-tip">
                                        <div className="tip-icon">💡</div>
                                        <div className="tip-content">
                                            <h4>Mindful Breathing</h4>
                                            <p>Practice deep breathing for 2 minutes when you feel stressed.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="health-card">
                                <h3>Weekly Progress</h3>
                                <div className="weekly-progress">
                                    <div className="progress-day">
                                        <div className="day-label">Mon</div>
                                        <div className="day-bar-container">
                                            <div className="day-bar" style={{ height: '60%' }}></div>
                                        </div>
                                    </div>
                                    <div className="progress-day">
                                        <div className="day-label">Tue</div>
                                        <div className="day-bar-container">
                                            <div className="day-bar" style={{ height: '75%' }}></div>
                                        </div>
                                    </div>
                                    <div className="progress-day">
                                        <div className="day-label">Wed</div>
                                        <div className="day-bar-container">
                                            <div className="day-bar" style={{ height: '90%' }}></div>
                                        </div>
                                    </div>
                                    <div className="progress-day">
                                        <div className="day-label">Thu</div>
                                        <div className="day-bar-container">
                                            <div className="day-bar" style={{ height: '65%' }}></div>
                                        </div>
                                    </div>
                                    <div className="progress-day">
                                        <div className="day-label">Fri</div>
                                        <div className="day-bar-container">
                                            <div className="day-bar" style={{ height: '80%' }}></div>
                                        </div>
                                    </div>
                                    <div className="progress-day">
                                        <div className="day-label">Sat</div>
                                        <div className="day-bar-container">
                                            <div className="day-bar" style={{ height: '50%' }}></div>
                                        </div>
                                    </div>
                                    <div className="progress-day">
                                        <div className="day-label">Sun</div>
                                        <div className="day-bar-container">
                                            <div className="day-bar today" style={{ height: '70%' }}></div>
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