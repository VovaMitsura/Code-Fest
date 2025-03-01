import "./App.css";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import { Routes, Route } from "react-router";

export default function App() {
  return (
    <>
      <Routes>
        {/* 
        <Route path="/" element={<Home />} />
        */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </>
  );
}
