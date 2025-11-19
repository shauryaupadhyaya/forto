import { useState } from "react";
import "../styles/tasks.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [tab, setTab] = useState("all");
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
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const today = new Date().toISOString().split("T")[0];
    if (tab === "today") return task.date === today;
    if (tab === "upcoming") return task.date > today;
    return true;
  });

  return (
    <div className="tasks-page">

      <h1 className="tasks-header">Tasks</h1>

      <div className="tasks-top-bar">
        <div className="tasks-tabs">
          {["all", "today", "upcoming"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`tab-btn ${tab === t ? "active" : ""}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <button className="new-task-btn" onClick={() => setShowNewTask(true)}>
          + New Task
        </button>
      </div>

      <div className="tasks-list">
        {filteredTasks.length === 0 && (
          <p className="empty-text">No tasks found.</p>
        )}

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
                <p>
                  {task.description} ({task.date})
                </p>
              </div>
            </div>

            <button className="delete-btn" onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {showNewTask && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>New Task</h2>

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newTask.title}
              onChange={handleInputChange}
            />

            <input
              type="text"
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
              <button className="add-btn" onClick={addTask}>
                Add
              </button>
              <button className="cancel-btn" onClick={() => setShowNewTask(false)}>
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