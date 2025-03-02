const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log(supabaseUrl, supabaseKey);
  console.error("Missing Supabase credentials in environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// User-specific data operations
const userOperations = {
  // Get user profile data
  getUserProfile: async (userId) => {
    console.log(`Getting profile for user: ${userId}`);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Profile fetch error:", error);
      throw error;
    }
    return data;
  },

  createUserProfileOnSignup: async (userData) => {
    console.log("Creating profile for new user:", userData.id);

    // First check if a profile already exists for this user
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userData.id)
      .single();

    if (existingProfile) {
      console.log("Profile already exists:", existingProfile);
      return existingProfile;
    }

    const newProfile = {
      user_id: userData.id,
      email: userData.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Attempting to insert profile:", newProfile);

    const { data, error } = await supabase
      .from("profiles")
      .insert(newProfile)
      .select();

    if (error) {
      console.error("Error creating user profile:", error);

      // Let's try a different approach if insert fails
      if (error.code === "23505") {
        // Duplicate key error
        console.log(
          "Profile exists but couldn't be fetched. Trying upsert instead."
        );
        const { data: upsertData, error: upsertError } = await supabase
          .from("profiles")
          .upsert(newProfile)
          .select();

        if (upsertError) {
          console.error("Upsert also failed:", upsertError);
          throw upsertError;
        }
        console.log("Successfully upserted profile:", upsertData);
        return upsertData;
      }
      throw error;
    }

    console.log("Created profile:", data);

    // Double-check the profile was created
    const { data: verifyData, error: verifyError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userData.id)
      .single();

    if (verifyError) {
      console.error("Couldn't verify profile creation:", verifyError);
    } else {
      console.log("Verified profile exists:", verifyData);
    }

    return data;
  },

  // Create or update user profile
  upsertUserProfile: async (userId, profileData) => {
    console.log(`Upserting profile for user: ${userId}`, profileData);

    // Ensure we're using the right column name and properly formatted dates
    const profile = {
      user_id: userId,
      ...profileData,
      updated_at: new Date().toISOString(),
    };

    // If there's no created_at, add it
    if (!profileData.created_at) {
      profile.created_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("profiles")
      .upsert(profile)
      .select();

    if (error) {
      console.error("Profile upsert error:", error);
      throw error;
    }

    console.log("Profile upsert result:", data);
    return data;
  },

  // Get items belonging to a specific user
  getUserItems: async (userId, options = {}) => {
    const {
      limit = 50,
      page = 0,
      orderBy = "created_at",
      ascending = false,
    } = options;
    const offset = page * limit;

    let query = supabase
      .from("items")
      .select("*")
      .eq("user_id", userId)
      .order(orderBy, { ascending })
      .limit(limit)
      .offset(offset);

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  // Add an item for a specific user
  addUserItem: async (userId, item) => {
    const { data, error } = await supabase
      .from("items")
      .insert({
        user_id: userId,
        ...item,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .select();

    if (error) throw error;
    return data;
  },

  // Update a specific user's item
  updateUserItem: async (userId, itemId, updates) => {
    const { data, error } = await supabase
      .from("items")
      .update({
        ...updates,
        updated_at: new Date(),
      })
      .eq("id", itemId)
      .eq("user_id", userId) // Ensures users can only update their own items
      .select();

    if (error) throw error;
    return data;
  },

  // Delete a specific user's item
  deleteUserItem: async (userId, itemId) => {
    const { error } = await supabase
      .from("items")
      .delete()
      .eq("id", itemId)
      .eq("user_id", userId); // Ensures users can only delete their own items

    if (error) throw error;
    return true;
  },
};

module.exports = {
  supabase,
  userOperations,
};
