import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
  return (
    <div className="dashboard-outer">
        <div className="dashboard">
        <div className="dashboard-header-row">
            <h1 className="dash-title">Good day! <span className="wave">👋</span></h1>
            <div className="dash-avatar">
                {/* add icon/logo here */}
            </div>
        </div>
        <p className="dash-sub">Let’s make today productive</p>

        <div className="stats-row">
            <div className="stat-card">
            <p className="stat-label">Today's Tasks</p>
            <h2 className="stat-value">0/0</h2>
            </div>
            <div className="stat-card">
            <p className="stat-label">Habits Today</p>
            <h2 className="stat-value">0/0</h2>
            </div>
            <div className="stat-card">
            <p className="stat-label">Workload</p>
            <h2 className="stat-value">0</h2>
            </div>
            <div className="stat-card">
            <p className="stat-label">Focus Time</p>
            <h2 className="stat-value">0m</h2>
            </div>
        </div>

        <div className="focus-box">
            <div>
            <h3>Quick Focus Session</h3>
            <p>Start a Pomodoro timer</p>
            </div>
            <button className="focus-btn" onClick={() => navigate("/pomodoro")}>Start Focus</button>
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
            <p className="empty-text">
            No habits tracked. Create one to build consistency!
            </p>
        </div>
        </div>
    </div>
  );
}

export default Dashboard;