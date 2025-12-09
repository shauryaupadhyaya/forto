import { useState, useEffect } from "react";
import "../styles/analytics.css";
import ActivityChart from "../components/graph.jsx";
import { FaFire } from "react-icons/fa6";

function Analytics() {
  const [selectedHabit, setSelectedHabit] = useState(
    localStorage.getItem("selectedHabit") || ""
  );

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const completedTasks =
    JSON.parse(localStorage.getItem("completedTasks")) || [];
  const habits = JSON.parse(localStorage.getItem("habits")) || [];

  const allTimeCompletedTasks = completedTasks.length;
  const totalHabits = habits.length;
  const allTimeFocus = Math.floor(
    Number(localStorage.getItem("focusTimeAllTime")) || 0
  );

  const bestHabit = habits.reduce(
    (max, h) => (h.bestStreak > max.bestStreak ? h : max),
    { bestStreak: 0 }
  );

  useEffect(() => {
    localStorage.setItem("selectedHabit", selectedHabit);
  }, [selectedHabit]);

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Analytics</h1>

      <div className="streak-card single-streak">
        <div className="streak-left">
          <p className="card-label">Habit</p>
          <select
            className="habit-select"
            value={selectedHabit}
            onChange={(e) => setSelectedHabit(e.target.value)}
          >
            <option value="">Select Habit</option>
            {habits.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        <div className="streak-right">
          <h2 className="streak-number">
            {selectedHabit
              ? habits.find((h) => h.id == selectedHabit)?.streak || 0
              : 0}
            <FaFire size={28} color="#ffae42" />
          </h2>
        </div>
      </div>

      <div className="stats-card">
        <div className="small-card">
          <p>Total Habits</p>
          <h2>{totalHabits}</h2>
        </div>

        <div className="small-card">
          <p>Total Tasks Completed</p>
          <h2>{allTimeCompletedTasks}</h2>
        </div>

        <div className="small-card">
          <p>Total Focus Time</p>
          <h2>{allTimeFocus}m</h2>
        </div>

        <div className="small-card">
          <p>Best Streak</p>
          <h2>
            {bestHabit.bestStreak} <FaFire size={28} color="#ffae42" />
          </h2>
          {bestHabit.bestStreak > 0 && <p>{bestHabit.name}</p>}
        </div>
      </div>

      <div className="graph-card">
        <h3 className="graph-title">Activity Overview</h3>
        <div className="graph-area">
          <ActivityChart tasks={tasks} habits={habits} selectedTab="habits" />
        </div>
      </div>
    </div>
  );
}

export default Analytics;