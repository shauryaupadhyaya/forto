import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();

  const [todayTasks, setTodayTasks] = useState({ done: 0, total: 0, remaining: [], completed: [] });
  const [todayHabits, setTodayHabits] = useState({ done: 0, total: 0, remaining: [], completed: [] });
  const [focusTime, setFocusTime] = useState(0);

  useEffect(() => {
    const updateTodayData = () => {
      const today = new Date().toISOString().split("T")[0];

      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

      const allTodayTasks = [
        ...tasks.filter((t) => t.date === today),
        ...completedTasks.filter((t) => t.date === today),
      ];

      const remaining = allTodayTasks.filter((t) => !t.completed).map((t) => t.title);
      const completed = allTodayTasks.filter((t) => t.completed).map((t) => t.title);

      setTodayTasks({
        done: completed.length,
        total: allTodayTasks.length,
        remaining,
        completed,
      });

      const habits = JSON.parse(localStorage.getItem("habits")) || [];
      const dailyHabits = habits.filter((h) => h.type === "daily");
      const remainingHabits = dailyHabits.filter((h) => !h.completed).map((h) => h.name);
      const completedHabits = dailyHabits.filter((h) => h.completed).map((h) => h.name);

      setTodayHabits({
        done: completedHabits.length,
        total: dailyHabits.length,
        remaining: remainingHabits,
        completed: completedHabits,
      });

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
    };

    updateTodayData();
    const interval = setInterval(updateTodayData, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderListWithColors = (remaining, completed) => {
    if (remaining.length === 0 && completed.length === 0) return <span>No items</span>;

    return (
      <>
        {remaining.length > 0 && <span className="red-text">{remaining.join(", ")}</span>}
        {remaining.length > 0 && completed.length > 0 && <span>, </span>}
        {completed.length > 0 && <span className="green-text">{completed.join(", ")}</span>}
      </>
    );
  };

  return (
    <div className="dashboard-outer">
      <div className="dashboard">
        <div className="dashboard-header-row">
          <h1 className="dash-title">
            Good day! <span className="wave">👋</span>
          </h1>
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
          <p className="empty-text">
            {renderListWithColors(todayTasks.remaining, todayTasks.completed)}
          </p>
        </div>

        <div className="section-card">
          <div className="section-header">
            <h3>Today's Habits</h3>
            <button className="focus-btn" onClick={() => navigate("/habits")}>+ Add Habit</button>
          </div>
          <p className="empty-text">
            {renderListWithColors(todayHabits.remaining, todayHabits.completed)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;