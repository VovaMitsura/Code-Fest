import "./App.css";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import HomePage from "./views/Home/homepage.jsx";
import Productivity from "./views/Productivity/Productivity.jsx";
import { Routes, Route, Navigate } from "react-router";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/productivity" element={<Productivity />} />
      </Routes>
    </>
  );
}
