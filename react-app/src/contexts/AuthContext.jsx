import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    // Check if there's a user session on load
    const checkUser = async () => {
      try {
        // Get stored session from localStorage
        const session = localStorage.getItem("session");
        if (session) {
          setUser(JSON.parse(session));
        }
      } catch (error) {
        console.error("Error checking user session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signup = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      setUser(data.user);
      localStorage.setItem("session", JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const signin = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      setUser(data.user);
      localStorage.setItem("session", JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error("Signin error:", error);
      throw error;
    }
  };

  const signout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/signout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      setUser(null);
      localStorage.removeItem("session");
    } catch (error) {
      console.error("Signout error:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signup,
    signin,
    signout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
