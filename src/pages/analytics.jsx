import { useState, useEffect } from "react";
import "../styles/analytics.css";
import ActivityChart from "../components/graph.jsx";
import { FaFire } from "react-icons/fa6";

function Analytics() {
  const [habitOne, setHabitOne] = useState(localStorage.getItem("habitOne") || "");
  const [habitTwo, setHabitTwo] = useState(localStorage.getItem("habitTwo") || "");

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
  const habits = JSON.parse(localStorage.getItem("habits")) || [];

  const allTimeCompletedTasks = completedTasks.length;
  const totalHabits = habits.length;
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
  const allTimeFocus = Math.floor(Number(localStorage.getItem("focusTimeAllTime")) || 0);

  useEffect(() => {
    localStorage.setItem("habitOne", habitOne);
  }, [habitOne]);

  useEffect(() => {
    localStorage.setItem("habitTwo", habitTwo);
  }, [habitTwo]);

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Analytics</h1>

      <div className="streak-section">
        {[habitOne, habitTwo].map((habitValue, idx) => (
          <div className="streak-card" key={idx}>
            <p className="card-label">Habit {idx + 1}</p>
            <select
              className="habit-select"
              value={habitValue}
              onChange={(e) =>
                idx === 0 ? setHabitOne(e.target.value) : setHabitTwo(e.target.value)
              }
            >
              <option value="">Select Habit</option>
              {habits.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
            <h2 className="streak-number">
              {habitValue ? habits.find((h) => h.id == habitValue)?.streak || 0 : 0}
              <FaFire size={28} color="#ffae42" />
            </h2>
          </div>
        ))}
      </div>

      <div className="stats-card">
        <div className="small-card">
          <p>Total Habits</p>
          <h2>{totalHabits}</h2>
        </div>

        <div className="small-card">
          <p>Tasks Completed (All-Time)</p>
          <h2>{allTimeCompletedTasks}</h2>
        </div>

        <div className="small-card">
          <p>Focus Time (All-Time)</p>
          <h2>{allTimeFocus}m</h2>
        </div>

        <div className="small-card">
          <p>Longest Streak</p>
          <h2>{longestStreak}</h2>
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