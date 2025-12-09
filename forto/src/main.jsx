import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout";
import Tasks from "./components/tasks";
import Dashboard from "./pages/dashboard";
import Habits from "./pages/habits"
import Focus from "./pages/focus";
import Analytics from "./pages/analytics";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="habits" element={<Habits />} />
          <Route path="pomodoro" element={<Focus />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);