const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");
const { userOperations } = require("./db/db");

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize express server
const server = express();
const PORT = process.env.PORT || 5000;

// Middleware
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Basic route
server.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

// Health check endpoint
server.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Auth endpoints
server.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Auth error during signup:", authError);
      return res.status(500).json({
        error: authError.message,
        details: "Failed to create user account",
      });
    }

    if (authData.user) {
      try {
        const profileData = await userOperations.createUserProfileOnSignup(
          authData.user
        );
        return res.status(200).json({
          user: authData.user,
          profile: profileData,
          message: "User created successfully with profile",
        });
      } catch (profileError) {
        console.error("Error creating user profile:", profileError);
        return res.status(200).json({
          user: authData.user,
          warning: "User created but profile creation failed",
          error: profileError.message,
        });
      }
    }

    return res.status(200).json({
      user: authData.user,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Unexpected error in signup:", error);
    res.status(500).json({
      error: "An unexpected error occurred",
      details: error.message,
    });
  }
});

server.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

server.post("/api/auth/signout", async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === "SIGNED_IN" && session?.user) {
    try {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (!existingProfile) {
        console.log("Creating profile for new sign-in:", session.user.id);
        await userOperations.createUserProfileOnSignup(session.user);
      }
    } catch (error) {
      console.error("Error in auth state change handler:", error);
    }
  }
});
