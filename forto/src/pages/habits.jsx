import { useState } from "react";
import "../styles/habits.css";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [tab, setTab] = useState("daily"); 
  const [showNewHabit, setShowNewHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    type: "daily",
  });

  const handleInputChange = (e) => {
    setNewHabit({ ...newHabit, [e.target.name]: e.target.value });
  };

  const addHabit = () => {
    if (!newHabit.name) return;

    setHabits([
      ...habits,
      { ...newHabit, id: Date.now() }
    ]);

    setNewHabit({ name: "", description: "", type: "daily" });
    setShowNewHabit(false);
  };

  const filteredHabits = habits.filter(
    (h) => h.type === tab
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

        <button
          className="new-habit-btn"
          onClick={() => setShowNewHabit(true)}
        >
          + New Habit
        </button>
      </div>

      {filteredHabits.length === 0 ? (
        <div className="empty-box-habits">
          <div className="empty-icon">📘</div>
          <p>No habits here yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="habit-list">
          {filteredHabits.map((habit) => (
            <div key={habit.id} className="habit-card">
              <div className="habit-info">
                <strong>{habit.name}</strong>
                <p>{habit.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showNewHabit && (
        <div className="popup-overlay">
          <div className="popup-window">

            <h2>New Habit</h2>

            <input
              type="text"
              name="name"
              placeholder="Habit Name"
              value={newHabit.name}
              onChange={handleInputChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={newHabit.description}
              onChange={handleInputChange}
            />

            <select
              name="type"
              value={newHabit.type}
              onChange={handleInputChange}
              className="habit-select"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>

            <div className="popup-buttons">
              <button className="popup-add" onClick={addHabit}>
                Add
              </button>
              <button
                className="popup-cancel"
                onClick={() => setShowNewHabit(false)}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Habits;