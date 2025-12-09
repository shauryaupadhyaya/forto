import { useState, useEffect } from "react";
import { FaFire } from "react-icons/fa6";
import "../styles/habits.css";

function Habits() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem("habits");
    return saved ? JSON.parse(saved) : [];
  });

  const [tab, setTab] = useState("daily");
  const [showNewHabit, setShowNewHabit] = useState(false);
  const [showEditHabit, setShowEditHabit] = useState(false);

  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    type: "daily",
    completed: false,
    streak: 0,
    lastCompletedDate: null,
  });

  const [editHabit, setEditHabit] = useState({
    id: null,
    name: "",
    description: "",
    type: "daily",
    completed: false,
    streak: 0,
    lastCompletedDate: null,
  });

  const getISODate = (date) => new Date(date).toISOString().split("T")[0];

  const getWeekNumber = (d) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  };

  useEffect(() => {
    const today = getISODate(new Date());
    const lastDailyReset = localStorage.getItem("lastDailyReset");
    const lastWeeklyReset = localStorage.getItem("lastWeeklyReset");
    const currentWeek = getWeekNumber(new Date()).toString();

    let updated = false;
    let newHabits = habits;

    if (lastDailyReset !== today) {
      newHabits = newHabits.map((h) =>
        h.type === "daily" ? { ...h, completed: false } : h
      );
      localStorage.setItem("lastDailyReset", today);
      updated = true;
    }

    if (lastWeeklyReset !== currentWeek) {
      newHabits = newHabits.map((h) =>
        h.type === "weekly" ? { ...h, completed: false } : h
      );
      localStorage.setItem("lastWeeklyReset", currentWeek);
      updated = true;
    }

    if (updated) {
      setHabits(newHabits);
    }
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const addHabit = () => {
    if (!newHabit.name.trim()) return;
    setHabits([...habits, { ...newHabit, id: Date.now() }]);
    setNewHabit({
      name: "",
      description: "",
      type: "daily",
      completed: false,
      streak: 0,
      lastCompletedDate: null,
    });
    setShowNewHabit(false);
  };

  const openEdit = (habit) => {
    setEditHabit({ ...habit });
    setShowEditHabit(true);
  };

  const saveEdit = () => {
    if (!editHabit.name.trim()) return;
    setHabits(habits.map((h) => (h.id === editHabit.id ? { ...editHabit } : h)));
    setShowEditHabit(false);
    setEditHabit({
      id: null,
      name: "",
      description: "",
      type: "daily",
      completed: false,
      streak: 0,
      lastCompletedDate: null,
    });
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((h) => h.id !== id));
  };

  const toggleComplete = (id) => {
    const today = getISODate(new Date());

    const newLog = JSON.parse(localStorage.getItem("habitCompletionLog")) || [];
    newLog.push({ habitId: id, date: today });
    localStorage.setItem("habitCompletionLog", JSON.stringify(newLog));

    setHabits((prevHabits) =>
      prevHabits.map((h) => {
        if (h.id !== id) return h;

        const completed = !h.completed;
        let newStreak = h.streak || 0;

        if (completed) newStreak += 1;
        else newStreak = Math.max(0, newStreak - 1);

        return {
          ...h,
          completed,
          streak: newStreak,
          lastCompletedDate: completed ? today : h.lastCompletedDate,
        };
      })
    );
  };

  const filteredHabits = habits.filter((h) => h.type === tab);

  const renderHabitCard = (habit) => (
    <div key={habit.id} className="habit-card">
      <div className="habit-left">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={habit.completed}
            onChange={() => toggleComplete(habit.id)}
          />
          <span className="checkmark"></span>
        </label>
        <div className={`habit-info ${!habit.description ? "no-description" : ""}`}>
          <strong className={habit.completed ? "completed-habit" : ""}>
            <span>{habit.name}</span>
          </strong>
          {habit.description && (
            <p className={habit.completed ? "completed-habit" : ""}>{habit.description}</p>
          )}
        </div>
      </div>
      <div className="habit-streak-container">
        <span className={`streak-badge ${habit.completed ? "lit" : "dim"}`}>
          <FaFire />
          {habit.completed && habit.streak > 0 && <span>{habit.streak}</span>}
        </span>
      </div>
      <div className="habit-actions">
        <button className="edit-btn" onClick={() => openEdit(habit)}>Edit</button>
        <button className="delete-btn" onClick={() => deleteHabit(habit.id)}>Delete</button>
      </div>
    </div>
  );

  return (
    <div className="habits-page">
      <h1 className="habits-title">Habits</h1>
      <div className="habits-header-bar">
        <div className="tabs-group">
          {["daily", "weekly"].map((t) => (
            <button
              key={t}
              className={`tab-pill ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <button className="new-habit-btn" onClick={() => setShowNewHabit(true)}>
          + New Habit
        </button>
      </div>

      {filteredHabits.length === 0 ? (
        <div className="empty-box"><p>No habits here yet. Create one to get started!</p></div>
      ) : (
        filteredHabits.map(renderHabitCard)
      )}

      {showNewHabit && (
        <div className="popup-overlay">
          <div className="popup-window">
            <h2>New Habit</h2>
            <input
              type="text"
              name="name"
              placeholder="Habit Name"
              autoFocus
              value={newHabit.name}
              onChange={(e) => handleInputChange(e, setNewHabit)}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newHabit.description}
              onChange={(e) => handleInputChange(e, setNewHabit)}
            />
            <select
              name="type"
              value={newHabit.type}
              onChange={(e) => handleInputChange(e, setNewHabit)}
              className="habit-select"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <div className="popup-buttons">
              <button className="popup-add" onClick={addHabit}>Add</button>
              <button className="popup-cancel" onClick={() => setShowNewHabit(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showEditHabit && (
        <div className="popup-overlay">
          <div className="popup-window">
            <h2>Edit Habit</h2>
            <input
              type="text"
              name="name"
              placeholder="Habit Name"
              value={editHabit.name}
              onChange={(e) => handleInputChange(e, setEditHabit)}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={editHabit.description}
              onChange={(e) => handleInputChange(e, setEditHabit)}
            />
            <select
              name="type"
              value={editHabit.type}
              onChange={(e) => handleInputChange(e, setEditHabit)}
              className="habit-select"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <div className="popup-buttons">
              <button className="popup-add" onClick={saveEdit}>Save</button>
              <button className="popup-cancel" onClick={() => setShowEditHabit(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Habits;