import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./components/layout";
import App from "./App";
import Tasks from "./components/tasks";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<App/>}/>
        <Route path="tasks" element={<Tasks/>}/>
        <Route path="habits" element={<div>Habits</div>}/>
        <Route path="pomodoro" element={<div>Pomodoro</div>}/>
        <Route path="calendar" element={<div>Calendar</div>}/>
        <Route path="analytics" element={<div>Analytics</div>}/>
        <Route path="settings" element={<div>Settings</div>}/>
      </Route>
    </Routes>
  </BrowserRouter>
)