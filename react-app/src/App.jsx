import "./App.css";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import HomePage from "./views/Home/homepage";
import Tasks from "./views/Tasks/Tasks";
import Settings from "./views/Settings/Settings";
import Dashboard from "./views/Dashboard/Dashboard";
import Health from "./views/Health/Health";
import { Routes, Route, Navigate } from "react-router";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/health" element={<Health />} />
      </Routes>
    </>
  );
}
