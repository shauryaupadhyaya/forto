import { useState } from "react";
import "../styles/tasks.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [tab, setTab] = useState("today");
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: "",
  });

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const addTask = () => {
    if (!newTask.title || !newTask.date) return;

    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);

    setNewTask({ title: "", description: "", date: "" });
    setShowNewTask(false);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const today = new Date().toISOString().split("T")[0];
  const filteredTasks = tasks.filter((task) => {
    if (tab === "today") return task.date === today;
    if (tab === "upcoming") return task.date > today;
    return true;
  });

  return (
    <div className="tasks-page">

      <h1 className="tasks-title">Tasks</h1>

      <div className="tasks-header-bar">
        <div className="tabs-group">
          {["today", "upcoming", "all"].map((t) => (
            <button
              key={t}
              className={`tab-pill ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <button className="new-task-btn" onClick={() => setShowNewTask(true)}>
          + New Task
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-box">
          <p>No tasks found. Create one to get started!</p>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <div className="task-card" key={task.id}>
              <div className="task-left">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                />
                <div className="task-info">
                  <strong>{task.title}</strong>
                  <p>{task.description} ({task.date})</p>
                </div>
              </div>

              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {showNewTask && (
        <div className="popup-overlay">
          <div className="popup-window">
            <h2>New Task</h2>

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newTask.title}
              onChange={handleInputChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={newTask.description}
              onChange={handleInputChange}
            />

            <input
              type="date"
              name="date"
              value={newTask.date}
              onChange={handleInputChange}
            />

            <div className="popup-buttons">
              <button className="popup-add" onClick={addTask}>Add</button>
              <button className="popup-cancel" onClick={() => setShowNewTask(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Tasks;