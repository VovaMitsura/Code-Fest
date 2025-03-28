import "./App.css";
import SignIn from "./views/Auth/SignIn";
import SignUp from "./views/Auth/SignUp";
import Home from "./views/Home/Home";
import Tasks from "./views/Tasks/Tasks";
import Settings from "./views/Settings/Settings";
import Dashboard from "./views/Dashboard/Dashboard";
import Health from "./views/Health/Health";
import AppPage from "./routes/routes";
import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const { user, loading } = useAuth();

  const authCheck = component => {
    if (!user && !loading) {
      return <Navigate to={AppPage.SIGNIN} />;
    }
    return component;
  };
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path={AppPage.DEFAULT} element={<Navigate to={AppPage.HOME} />} />
        <Route path={AppPage.HOME} element={<Home />} />
        <Route path={AppPage.SIGNUP} element={<SignUp />} />
        <Route path={AppPage.SIGNIN} element={<SignIn />} />

        {/* Protected Routes */}
        <Route path={AppPage.TASKS} element={authCheck(<Tasks />)} />
        <Route path={AppPage.SETTINGS} element={authCheck(<Settings />)} />
        <Route path={AppPage.DASHBOARD} element={authCheck(<Dashboard />)} />
        <Route path={AppPage.HEALTH} element={authCheck(<Health />)} />
      </Routes>
    </>
  );
}
