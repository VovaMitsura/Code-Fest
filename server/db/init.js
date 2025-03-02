const { supabase } = require("./db");
require("dotenv").config();

async function checkDatabase() {
  console.log("Checking database structure...");

  // Check if profiles table exists
  const { error } = await supabase.from("profiles").select("user_id").limit(1);

  if (error && error.code === "42P01") {
    console.error(
      "Profiles table doesn't exist. Please run the SQL script in Supabase SQL Editor."
    );
    return false;
  } else if (error) {
    console.error("Error checking profiles table:", error);
    return false;
  } else {
    console.log("Profiles table exists");
    return true;
  }
}

module.exports = {
  initializeDatabase: async () => {
    try {
      const dbReady = await checkDatabase();
      return dbReady;
    } catch (error) {
      console.error("Database check failed:", error);
      return false;
    }
  },
};
