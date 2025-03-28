import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Tasks.css";
import { useAuth } from "../../contexts/AuthContext.jsx";

const Tasks = () => {
  const { user, getAccessToken } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [task, setTask] = useState([]);
  const [newTask, setNewTask] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!user?.email) return; // Ensure email exists

    const fetchTasks = async () => {
      try {
        const token = await getAccessToken();
        const response = await fetch(`${API_URL}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch tasks");
        }

        const today = new Date().toISOString().split("T")[0];

        const todayTasks = data.tasks.filter(task => {
          return task.date.startsWith(today);
        });

        setTask(todayTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const addTask = async taskText => {
    const token = await getAccessToken();
    if (!taskText.trim() || !user?.email) return; // Ensure email exists

    try {
      console.log("Sending task to server...");
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          body: taskText,
          is_reminder: false,
          remind_date: null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTask([...task, data.task]); // Update state with new task
      } else {
        console.error("Error adding task:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const deleteTask = taskId => {
    setTask(task.filter(task => task.id !== taskId));
  };

  const toggleTaskCompletion = taskId => {
    setTask(task.map(task => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
  };

  const handleNavigation = page => {
    if (page === "dashboard") {
      navigate("/dashboard");
    } else {
      navigate(`/${page}`);
    }
  };

  return (
    <div className='dashboard-container'>
      <Sidebar sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />

      <main className='main-content'>
        <div className='dashboard-content'>
          <div className='welcome-banner'>
            <div className='welcome-content'>
              <h1>Tasks</h1>
            </div>
          </div>

          <div className='tasks-section'>
            <div className='task-input-container'>
              <div className='task-input-wrapper'>
                <input
                  type='text'
                  value={newTask}
                  onChange={e => setNewTask(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder='Add a new task...'
                  className='task-input'
                />
                <button onClick={() => addTask(newTask)} className='add-task-btn'>
                  Add Task
                </button>
              </div>
            </div>

            <div className='task-columns'>
              <div className='task-column'>
                <h3 className='column-header'>
                  <span className='column-icon'>⏳</span> In Progress
                </h3>
                <div className='task-list'>
                  {task
                    .filter(task => !task.completed)
                    .map(task => (
                      <div key={task.id} className='task-item'>
                        <div className='task-checkbox' onClick={() => toggleTaskCompletion(task.id)}>
                          <div className='checkbox-inner'></div>
                        </div>
                        <span className='task-text'>{task.body}</span>
                        <button className='delete-task-btn' onClick={() => deleteTask(task.id)}>
                          ×
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              <div className='task-column'>
                <h3 className='column-header'>
                  <span className='column-icon'>✅</span> Completed
                </h3>
                <div className='task-list'>
                  {task
                    .filter(task => task.completed)
                    .map(task => (
                      <div key={task.id} className='task-item completed'>
                        <div className='task-checkbox checked' onClick={() => toggleTaskCompletion(task.id)}>
                          <div className='checkbox-inner'>✓</div>
                        </div>
                        <span className='task-text'>{task.body}</span>
                        <button className='delete-task-btn' onClick={() => deleteTask(task.id)}>
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
