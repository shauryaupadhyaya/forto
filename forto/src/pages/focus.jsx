import { useState, useEffect, useRef } from "react";
import "../styles/focus.css";

function Focus() {
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("focus");
  const timerRef = useRef(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem("focusDate");
    if (saved !== today) {
      localStorage.setItem("focusDate", today);
      localStorage.setItem("focusTimeToday", 0);
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (mode === "focus") {
          const t = Number(localStorage.getItem("focusTimeToday")) || 0;
          const a = Number(localStorage.getItem("focusTimeAllTime")) || 0;
          localStorage.setItem("focusTimeToday", t + 1 / 60);
          localStorage.setItem("focusTimeAllTime", a + 1 / 60);
        }

        if (prev <= 1) {
          clearInterval(timerRef.current);

          if (mode === "focus") {
            setMode("break");
            setTimeLeft(breakDuration * 60);
            setIsRunning(true);
          } else {
            setMode("focus");
            setTimeLeft(focusDuration * 60);
            setIsRunning(false);
          }
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode, breakDuration, focusDuration]);

  const startPause = () => setIsRunning((p) => !p);

  const resetTimer = () => {
    setIsRunning(false);
    setMode("focus");
    setTimeLeft(focusDuration * 60);
    clearInterval(timerRef.current);
  };

  const skipToBreak = () => {
    setMode("break");
    setTimeLeft(breakDuration * 60);
    setIsRunning(false);
  };

  const switchModeManually = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === "focus") setTimeLeft(focusDuration * 60);
    else setTimeLeft(breakDuration * 60);
  };

  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const secs = (timeLeft % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="focus-page">
      <h1 className="focus-title">Focus Timer</h1>

      <div className="tabs-group">
        <button
          className={`tab-pill ${mode === "focus" ? "active" : ""}`}
          onClick={() => switchModeManually("focus")}
        >
          Focus
        </button>
        <button
          className={`tab-pill ${mode === "break" ? "active" : ""}`}
          onClick={() => switchModeManually("break")}
        >
          Break
        </button>
      </div>

      <div className={`timer-box ${mode === "break" ? "break-mode" : ""}`}>
        <p className="mode-label">{mode === "focus" ? "Focus Time" : "Break Time"}</p>
        <h1 className="timer-display">{formatTime()}</h1>

        <div className="timer-buttons">
          <button className="start-btn" onClick={startPause}>
            {isRunning ? "Pause" : "Start"}
          </button>
          <button className="reset-btn" onClick={resetTimer}>
            Reset
          </button>
          <button className="skip-btn" onClick={skipToBreak}>
            Skip
          </button>
        </div>
      </div>

      <div className="settings-box">
        <h3>Personalise</h3>

        <label>Focus Duration (minutes)</label>
        <input
          type="number"
          min="1"
          value={focusDuration}
          onChange={(e) => {
            setFocusDuration(Number(e.target.value));
            if (mode === "focus") setTimeLeft(Number(e.target.value) * 60);
          }}
        />

        <label>Break Duration (minutes)</label>
        <input
          type="number"
          min="1"
          value={breakDuration}
          onChange={(e) => {
            setBreakDuration(Number(e.target.value));
            if (mode === "break") setTimeLeft(Number(e.target.value) * 60);
          }}
        />
      </div>
    </div>
  );
}

export default Focus;