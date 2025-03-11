import "./App.css";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Home from "./views/Home/Home";
import Tasks from "./views/Tasks/Tasks";
import Settings from "./views/Settings/Settings";
import Dashboard from "./views/Dashboard/Dashboard";
import Health from "./views/Health/Health";
import AppPage from "./routes/routes";
import { Routes, Route, Navigate } from "react-router";

export default function App() {
  return (
    <>
      <Routes>
        <Route path={AppPage.DEFAULT} element={<Navigate to={AppPage.HOME} />} />
        <Route path={AppPage.HOME} element={<Home />} />
        <Route path={AppPage.SIGNUP} element={<SignUp />} />
        <Route path={AppPage.SIGNIN} element={<SignIn />} />
        <Route path={AppPage.TASKS} element={<Tasks />} />
        <Route path={AppPage.SETTINGS} element={<Settings />} />
        <Route path={AppPage.DASHBOARD} element={<Dashboard />} />
        <Route path={AppPage.HEALTH} element={<Health />} />
      </Routes>
    </>
  );
}
