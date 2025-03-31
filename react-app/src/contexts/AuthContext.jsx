import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../providers/supabase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, phoneNumber) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) {
        const token = await getAccessToken();
        await fetch("http://localhost:5000/api/auth/delete-user", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (authData?.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            user_id: authData.user.id,
            email: email,
            phone_number: phoneNumber,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ]);
        if (profileError) {
          console.error("Error creating profile: ", profileError);
          throw profileError;
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const signin = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      setUser(data.user);
      return data;
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

  const getAccessToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      return session.access_token;
    } else {
      throw new Error("No active session found");
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
    getAccessToken,
  };
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
