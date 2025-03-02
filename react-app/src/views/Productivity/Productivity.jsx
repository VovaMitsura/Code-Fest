import React, { useState, useEffect } from 'react';
import "./Productivity.css";

const Productivity = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentDate, setCurrentDate] = useState('');
    const [tasks, setTasks] = useState([]);
    const [focusItems, setFocusItems] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        const date = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        setCurrentDate(date);
    }, []);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const addTask = (taskText) => {
        if (taskText.trim()) {
            setTasks([...tasks, { id: Date.now(), text: taskText, completed: false }]);
        }
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const toggleTaskCompletion = (taskId) => {
        setTasks(tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task));
    };

    const removeFocusItem = (focusId) => {
        setFocusItems(focusItems.filter(item => item.id !== focusId));
    };

    const updateCalendar = (date) => {
        setCurrentMonth(date);
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const today = new Date();
        const currentYear = currentMonth.getFullYear();
        const currentMonthIndex = currentMonth.getMonth();

        let days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = currentYear === today.getFullYear() && currentMonthIndex === today.getMonth() && i === today.getDate();
            days.push(
                <div key={`day-${i}`} className={`calendar-day ${isToday ? 'today' : ''}`}>
                    {i}
                </div>
            );
        }

        return days;
    };
    return (
        <div className="container">
            <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
                </button>
                <div className="logo">
                    <img src="./waveslogo.jpg" alt="Logo" />
                </div>
                <nav>
                    <ul>
                        <li><a href="index.html"><i className="fas fa-house nav-icon"></i><span className="nav-text">Dashboard</span></a></li>
                        <li><a href="productivity.html" className="active"><i className="fas fa-tasks nav-icon"></i><span className="nav-text">Productivity</span></a></li>
                        <li><a href="livelihood.html"><i className="fas fa-heart nav-icon"></i><span className="nav-text">Livelihood</span></a></li>
                        <li><a href="my-agent.html"><i className="fas fa-user nav-icon"></i><span className="nav-text">My Agent</span></a></li>
                        <li><a href="health.html"><i className="fas fa-heartbeat nav-icon"></i><span className="nav-text">Health</span></a></li>
                        <li><a href="report.html"><i className="fas fa-file-alt nav-icon"></i><span className="nav-text">Report</span></a></li>
                        <li><a href="settings.html"><i className="fas fa-gear nav-icon"></i><span className="nav-text">Settings</span></a></li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content">
                <header className="header">
                    <h1 style={{ color: '#333333' }}>Productivity</h1>
                    <p className="date" style={{ color: '#666666' }}>Today's Date: <span>{currentDate}</span></p>
                </header>
                <div className="dashboard-grid">
                    <div className="card glass-effect" style={{ gridColumn: 'span 2' }}>
                        <div className="task-header">
                            <h3 style={{ color: '#055ffc', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
                                Task Management
                                <span className="task-percentage" style={{ color: '#666666', fontSize: '1.2rem', marginLeft: '15px' }}>
                  ({tasks.filter(task => task.completed).length / tasks.length * 100}% Complete)
                </span>
                            </h3>
                        </div>
                        <div className="task-input-container">
                            <div className="modern-input-wrapper">
                                <i className="fas fa-plus" style={{ color: '#055ffc' }}></i>
                                <input type="text" id="newTask" className="task-input" placeholder="Add a new task..." onKeyPress={(e) => e.key === 'Enter' && addTask(e.target.value)} />
                                <button onClick={() => addTask(document.getElementById('newTask').value)} className="modern-add-btn">Add Task</button>
                            </div>
                        </div>
                        <div className="task-columns">
                            <div className="task-column" id="todoTasks">
                                <h4 style={{ color: '#333333' }}>
                                    <i className="fas fa-spinner fa-spin" style={{ color: '#055ffc', marginRight: '8px' }}></i>
                                    To Do
                                </h4>
                                {tasks.filter(task => !task.completed).map(task => (
                                    <div key={task.id} className="task-item" draggable onDragStart={(e) => e.dataTransfer.setData('text', task.id)}>
                                        <span className="task-text">{task.text}</span>
                                        <div className="task-actions">
                                            <button className="delete-btn" onClick={() => deleteTask(task.id)}><i className="fas fa-trash"></i></button>
                                            <button className="grip-btn" onClick={() => toggleTaskCompletion(task.id)}><i className="fas fa-grip-lines"></i></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="task-column" id="doneTasks">
                                <h4 style={{ color: '#333333' }}><i className="fas fa-check-circle" style={{ color: '#055ffc', marginRight: '8px' }}></i>Completed</h4>
                                {tasks.filter(task => task.completed).map(task => (
                                    <div key={task.id} className="task-item completed" draggable onDragStart={(e) => e.dataTransfer.setData('text', task.id)}>
                                        <span className="task-text">{task.text}</span>
                                        <div className="task-actions">
                                            <button className="delete-btn" onClick={() => deleteTask(task.id)}><i className="fas fa-trash"></i></button>
                                            <button className="grip-btn" onClick={() => toggleTaskCompletion(task.id)}><i className="fas fa-grip-lines"></i></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="card glass-effect">
                        <h3 style={{ color: '#055ffc' }}>Calendar</h3>
                        <div className="calendar">
                            <div className="calendar-header">
                                <button className="calendar-btn" onClick={() => updateCalendar(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}><i className="fas fa-chevron-left"></i></button>
                                <h4>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
                                <button className="calendar-btn" onClick={() => updateCalendar(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}><i className="fas fa-chevron-right"></i></button>
                            </div>
                            <div className="calendar-weekdays">
                                <div>Sun</div>
                                <div>Mon</div>
                                <div>Tue</div>
                                <div>Wed</div>
                                <div>Thu</div>
                                <div>Fri</div>
                                <div>Sat</div>
                            </div>
                            <div className="calendar-days">
                                {generateCalendarDays()}
                            </div>
                        </div>
                    </div>
                    <div className="card glass-effect">
                        <h3 style={{ color: '#055ffc' }}>Reminders</h3>
                        <div className="reminders-section">
                            <div className="reminder-item">
                                <div className="reminder-time"><i className="fas fa-clock" style={{ color: '#055ffc' }}></i><span>9:00 AM</span></div>
                                <span className="reminder-text">Team Stand-up Meeting</span>
                            </div>
                            <div className="reminder-item">
                                <div className="reminder-time"><i className="fas fa-clock" style={{ color: '#055ffc' }}></i><span>2:30 PM</span></div>
                                <span className="reminder-text">Project Review</span>
                            </div>
                            <div className="reminder-item">
                                <div className="reminder-time"><i className="fas fa-clock" style={{ color: '#055ffc' }}></i><span>4:00 PM</span></div>
                                <span className="reminder-text">Client Call</span>
                            </div>
                        </div>
                    </div>
                    <div className="card glass-effect">
                        <h3 style={{ color: '#055ffc' }}>Weekly Focus</h3>
                        <div className="focus-section">
                            {focusItems.map(item => (
                                <div key={item.id} className="focus-item">
                                    <span className="focus-text">{item.text}</span>
                                    <button className="remove-focus" onClick={() => removeFocusItem(item.id)}><i className="fas fa-times"></i></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card glass-effect">
                        <h3 style={{ color: '#055ffc' }}>Yearly Goals</h3>
                        <div className="goals-section">
                            <div className="goal-item"><span className="goal-text">Complete Advanced Certification</span></div>
                            <div className="goal-item"><span className="goal-text">Launch Personal Project</span></div>
                            <div className="goal-item"><span className="goal-text">Improve Team Leadership Skills</span></div>
                            <div className="goal-item"><span className="goal-text">Expand Professional Network</span></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Productivity;