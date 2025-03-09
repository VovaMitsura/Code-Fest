import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import "./Tasks.css";

const Tasks = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [tasks, setTasks] = useState([
        { id: 1, text: "Complete project proposal", completed: false },
        { id: 2, text: "Review team's progress", completed: false },
        { id: 3, text: "Schedule client meeting", completed: true },
        { id: 4, text: "Update documentation", completed: false }
    ]);
    const [newTask, setNewTask] = useState('');
    const navigate = useNavigate();

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
        const time = new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        });
        setCurrentTime(time);
    }, []);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const addTask = () => {
        if (newTask.trim()) {
            setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
            setNewTask('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const toggleTaskCompletion = (taskId) => {
        setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    const handleNavigation = (page) => {
        if (page === 'dashboard') {
            navigate('/dashboard');
        } else {
            navigate(`/${page}`);
        }
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
                            <h1>Tasks</h1>
                            <p className="date-display">{currentDate}</p>
                            <p className="time-display">{currentTime}</p>
                        </div>
                    </div>
                    
                    <div className="tasks-section">
                        <div className="task-input-container">
                            <div className="task-input-wrapper">
                                <input 
                                    type="text" 
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Add a new task..." 
                                    className="task-input" 
                                />
                                <button onClick={addTask} className="add-task-btn">
                                    Add Task
                                </button>
                            </div>
                        </div>

                        <div className="task-columns">
                            <div className="task-column">
                                <h3 className="column-header">
                                    <span className="column-icon">⏳</span> In Progress
                                </h3>
                                <div className="task-list">
                                    {tasks.filter(task => !task.completed).map(task => (
                                        <div key={task.id} className="task-item">
                                            <div className="task-checkbox" onClick={() => toggleTaskCompletion(task.id)}>
                                                <div className="checkbox-inner"></div>
                                            </div>
                                            <span className="task-text">{task.text}</span>
                                            <button className="delete-task-btn" onClick={() => deleteTask(task.id)}>
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="task-column">
                                <h3 className="column-header">
                                    <span className="column-icon">✅</span> Completed
                                </h3>
                                <div className="task-list">
                                    {tasks.filter(task => task.completed).map(task => (
                                        <div key={task.id} className="task-item completed">
                                            <div className="task-checkbox checked" onClick={() => toggleTaskCompletion(task.id)}>
                                                <div className="checkbox-inner">✓</div>
                                            </div>
                                            <span className="task-text">{task.text}</span>
                                            <button className="delete-task-btn" onClick={() => deleteTask(task.id)}>
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Tasks; 