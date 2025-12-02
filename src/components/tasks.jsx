import { useState, useEffect } from "react";
import "../styles/tasks.css";

function getLocalISODateString(date) {
  const offset = date.getTimezoneOffset();
  const d = new Date(date.getTime() - offset * 60000);
  return d.toISOString().split("T")[0];
}

function zeroTime(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

const today = zeroTime(new Date());
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

function Tasks() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [tab, setTab] = useState("today");
  const [showNewTask, setShowNewTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", date: "" });
  const [editTask, setEditTask] = useState({ id: null, title: "", description: "", date: "" });

  const [removedTask, setRemovedTask] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e, setter) => {
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addTask = () => {
    if (!newTask.title || !newTask.date) return;
    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
    setNewTask({ title: "", description: "", date: "" });
    setShowNewTask(false);
  };

  const openEdit = (task) => {
    setEditTask({ ...task });
    setShowEditTask(true);
  };

  const saveEdit = () => {
    if (!editTask.title || !editTask.date) return;
    setTasks(tasks.map((t) => (t.id === editTask.id ? { ...editTask } : t)));
    setShowEditTask(false);
    setEditTask({ id: null, title: "", description: "", date: "" });
  };

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const toggleComplete = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    setTasks(tasks.filter((t) => t.id !== id));
    setRemovedTask(task);

    const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    localStorage.setItem("completedTasks", JSON.stringify([...completedTasks, { ...task, completed: true }]));

    if (undoTimer) clearTimeout(undoTimer);

    const timer = setTimeout(() => setRemovedTask(null), 5000);
    setUndoTimer(timer);
  };

  const undoRemove = () => {
    if (removedTask) {
      setTasks([...tasks, removedTask]);
      const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
      localStorage.setItem("completedTasks", JSON.stringify(completedTasks.filter(t => t.id !== removedTask.id)));
      setRemovedTask(null);
      if (undoTimer) clearTimeout(undoTimer);
    }
  };

  const todayISO = getLocalISODateString(today);
  const tomorrowISO = getLocalISODateString(tomorrow);

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const d = zeroTime(new Date(dateStr));
    if (d.getTime() === today.getTime()) return "Today";
    if (d.getTime() === tomorrow.getTime()) return "Tomorrow";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const todayTasks = tasks
    .filter((t) => zeroTime(new Date(t.date)).getTime() === today.getTime())
    .sort((a, b) => a.title.localeCompare(b.title));

  const allTasksByDate = tasks
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, task) => {
      const label = formatDisplayDate(task.date);
      if (!acc[label]) acc[label] = [];
      acc[label].push(task);
      return acc;
    }, {});

  const renderTaskCard = (task) => (
    <div key={task.id} className="task-card">
      <div className="task-left">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={task.completed}
            aria-label={`Mark ${task.title} as complete`}
            onChange={() => toggleComplete(task.id)}
            tabIndex={0}
          />
          <span className="checkmark"></span>
        </label>
        <div className="task-info">
          <strong className={task.completed ? "completed-task" : ""}>{task.title}</strong>
          <p className={task.completed ? "completed-task" : ""}>
            {task.description} {task.date ? `(${formatDisplayDate(task.date)})` : ""}
          </p>
        </div>
      </div>
      <div className="task-actions">
        <button className="edit-btn" onClick={() => openEdit(task)}>Edit</button>
        <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
      </div>
    </div>
  );

  return (
    <div className="tasks-page">
      <h1 className="tasks-title">Tasks</h1>

      <div className="tasks-header-bar">
        <div className="tabs-group">
          {["today", "all"].map((t) => (
            <button
              key={t}
              className={`tab-pill ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <button className="new-task-btn" onClick={() => setShowNewTask(true)}>+ New Task</button>
      </div>

      {tab === "today" &&
        (todayTasks.length === 0 ? (
          <div className="empty-box"><p>No tasks for today.</p></div>
        ) : (
          todayTasks.map(renderTaskCard)
        ))}

      {tab === "all" &&
        (Object.keys(allTasksByDate).length === 0 ? (
          <div className="empty-box"><p>No tasks yet.</p></div>
        ) : (
          Object.keys(allTasksByDate).map((dateLabel) => (
            <div key={dateLabel} className="all-date-group">
              <div className="date-label">{dateLabel}</div>
              {allTasksByDate[dateLabel].map(renderTaskCard)}
            </div>
          ))
        ))}

      {removedTask && (
        <div className="undo-popup">
          <span>Task "{removedTask.title}" completed</span>
          <button onClick={undoRemove}>Undo</button>
        </div>
      )}

      {showNewTask && (
        <div className="popup-overlay">
          <div className="popup-window">
            <h2>New Task</h2>
            <input type="text" name="title" placeholder="Title" autoFocus value={newTask.title} onChange={(e) => handleInputChange(e, setNewTask)} />
            <textarea name="description" placeholder="Description" value={newTask.description} onChange={(e) => handleInputChange(e, setNewTask)} />
            <div className="date-shortcuts">
              <button type="button" className={newTask.date === todayISO ? "active-date-shortcut" : ""} onClick={() => setNewTask({ ...newTask, date: todayISO })}>Today</button>
              <button type="button" className={newTask.date === tomorrowISO ? "active-date-shortcut" : ""} onClick={() => setNewTask({ ...newTask, date: tomorrowISO })}>Tomorrow</button>
            </div>
            <input type="date" name="date" min={todayISO} value={newTask.date} onChange={(e) => handleInputChange(e, setNewTask)} />
            <div className="popup-buttons">
              <button className="popup-add" onClick={addTask}>Add</button>
              <button className="popup-cancel" onClick={() => setShowNewTask(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showEditTask && (
        <div className="popup-overlay">
          <div className="popup-window">
            <h2>Edit Task</h2>
            <input type="text" name="title" placeholder="Title" value={editTask.title} onChange={(e) => handleInputChange(e, setEditTask)} />
            <textarea name="description" placeholder="Description" value={editTask.description} onChange={(e) => handleInputChange(e, setEditTask)} />
            <div className="date-shortcuts">
              <button
                type="button"
                className={editTask.date === todayISO ? "active-date-shortcut" : ""}
                onClick={() => setEditTask({ ...editTask, date: todayISO})}
              >
                Today
              </button>

              <button
                type="button"
                className={editTask.date === tomorrowISO ? "active-date-shortcut" : ""}
                onClick={() => setEditTask({ ...editTask, date: tomorrowISO})}
              >
                Tomorrow
              </button>
            </div>
            <input type="date" name="date" min={todayISO} value={editTask.date} onChange={(e) => handleInputChange(e, setEditTask)} />
            <div className="popup-buttons">
              <button className="popup-add" onClick={saveEdit}>Save</button>
              <button className="popup-cancel" onClick={() => setShowEditTask(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;