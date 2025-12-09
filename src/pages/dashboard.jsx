import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();

  const [todayTasks, setTodayTasks] = useState({ done: 0, total: 0 });
  const [todayHabits, setTodayHabits] = useState({ done: 0, total: 0 });
  const [focusTime, setFocusTime] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

    const todayActive = tasks.filter((t) => t.date === today);
    const todayCompleted = completedTasks.filter((t) => t.date === today);

    const done = todayCompleted.length;
    const total = todayActive.length + todayCompleted.length;
    setTodayTasks({ done, total });

    const habits = JSON.parse(localStorage.getItem("habits")) || [];
    const daily = habits.filter((h) => h.type === "daily");
    const completed = daily.filter((h) => h.completed).length;
    setTodayHabits({ done: completed, total: daily.length });

    const savedDate = localStorage.getItem("focusDate");
    const dateToday = new Date().toDateString();

    if (savedDate !== dateToday) {
      localStorage.setItem("focusTimeToday", 0);
      localStorage.setItem("focusDate", dateToday);
      setFocusTime(0);
    } else {
      const ft = Number(localStorage.getItem("focusTimeToday")) || 0;
      setFocusTime(Math.floor(ft));
    }
  }, []);

  return (
    <div className="dashboard-outer">
      <div className="dashboard">
        <div className="dashboard-header-row">
          <h1 className="dash-title">Good day! <span className="wave">👋</span></h1>
          <div className="dash-avatar"></div>
        </div>

        <p className="dash-sub">Let’s make today productive</p>

        <div className="stats-row">
          <div className="stat-card">
            <p className="stat-label">Today's Tasks</p>
            <h2 className="stat-value">{todayTasks.done}/{todayTasks.total}</h2>
          </div>

          <div className="stat-card">
            <p className="stat-label">Habits Today</p>
            <h2 className="stat-value">{todayHabits.done}/{todayHabits.total}</h2>
          </div>

          <div className="stat-card">
            <p className="stat-label">Focus Time Today</p>
            <h2 className="stat-value">{focusTime}m</h2>
          </div>
        </div>

        <div className="focus-box">
          <div>
            <h3>Quick Focus Session</h3>
            <p>Start a Pomodoro timer</p>
          </div>
          <button className="focus-btn" onClick={() => navigate("/pomodoro")}>
            Start Focus
          </button>
        </div>

        <div className="section-card">
          <div className="section-header">
            <h3>Today's Tasks</h3>
            <button className="focus-btn" onClick={() => navigate("/tasks")}>+ Add Task</button>
          </div>
          <p className="empty-text">No tasks for today. Add one to get started!</p>
        </div>

        <div className="section-card">
          <div className="section-header">
            <h3>Today's Habits</h3>
            <button className="focus-btn" onClick={() => navigate("/habits")}>+ Add Habit</button>
          </div>
          <p className="empty-text">No habits tracked. Create one to build consistency!</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;