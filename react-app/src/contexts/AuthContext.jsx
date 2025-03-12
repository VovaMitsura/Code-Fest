import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../providers/supabase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password) => {
    try {
      await supabase.auth.signUp({
        email,
        password,
      });
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const signin = async (email, password) => {
    try {
      const { data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setUser(data.user);
    } catch (error) {
      console.error("Signin error:", error);
      throw error;
    }
  };

  const signout = async () => {
    try {
      await supabase.auth.signOut({});
      setUser(null);
    } catch (error) {
      console.error("Signout error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Check for existing session on load
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    signup,
    signin,
    signout,
  };
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
