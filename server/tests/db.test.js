const axios = require("axios");
const { supabase, userOperations } = require("../db/db");
const { initializeDatabase } = require("../db/init");
const fs = require("fs");
const path = require("path");

const API_URL = "http://localhost:5000";
let testUser;
let authToken;

describe("Environment and Configuration Tests", () => {
  test("Environment variables are loaded correctly", () => {
    expect(process.env.SUPABASE_URL).toBeDefined();
    expect(process.env.SUPABASE_SERVICE_KEY).toBeDefined();
  });

  test("Supabase client is initialized", () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(supabase.from).toBeDefined();
  });

  test("env file exists in the correct location", () => {
    const envPath = path.resolve(__dirname, "../.env");
    expect(fs.existsSync(envPath)).toBe(true);
  });
});

describe("Database Initialization Tests", () => {
  test("Database initialization should complete without errors", async () => {
    const result = await initializeDatabase();
    expect(result).toBe(true);
  });

  test("Profiles table should exist", async () => {
    const { error } = await supabase
      .from("profiles")
      .select("user_id")
      .limit(1);
    expect(error).toBeNull();
  });
});

describe("Authentication API Tests", () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "Test123!@#";

  test("Should sign up a new user", async () => {
    const response = await axios.post(`${API_URL}/api/auth/signup`, {
      email: testEmail,
      password: testPassword,
    });

    expect(response.status).toBe(200);
    expect(response.data.user).toBeDefined();
    expect(response.data.user.email).toBe(testEmail);
    testUser = response.data.user;
  });

  test("Should sign in with created user", async () => {
    const response = await axios.post(`${API_URL}/api/auth/signin`, {
      email: testEmail,
      password: testPassword,
    });

    expect(response.status).toBe(200);
    expect(response.data.user).toBeDefined();
    expect(response.data.session).toBeDefined();
    expect(response.data.session.access_token).toBeDefined();
    authToken = response.data.session.access_token;
  });

  test("Should not sign up with invalid credentials", async () => {
    try {
      await axios.post(`${API_URL}/api/auth/signup`, {
        email: "invalid-email",
        password: "short",
      });
      fail("Should have thrown an error");
    } catch (error) {
      expect(error.response.status).toBe(500);
    }
  });
});

describe("Profile Operations Tests", () => {
  test("Should create profile when user signs up", async () => {
    if (!testUser) {
      throw new Error("Test user was not created properly");
    }

    // Wait a moment for any async operations to complete
    await new Promise((r) => setTimeout(r, 1000));

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", testUser.id)
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.user_id).toBe(testUser.id);
  });

  test("Should fetch user profile via API", async () => {
    if (!authToken) {
      throw new Error("Auth token was not obtained properly");
    }

    try {
      const response = await axios.get(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.user_id).toBe(testUser.id);
    } catch (error) {
      console.error("Error response:", error.response?.data);
      throw error;
    }
  });

  test("Should update user profile", async () => {
    if (!authToken) {
      throw new Error("Auth token was not obtained properly");
    }

    const updates = {
      name: "Test User",
      bio: "This is a test profile",
    };

    const response = await axios.put(`${API_URL}/api/profile`, updates, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.name).toBe(updates.name);
    expect(response.data.bio).toBe(updates.bio);
  });
});

describe("User Operations Tests", () => {
  test("getUserProfile should retrieve a profile by userId", async () => {
    if (!testUser) {
      throw new Error("Test user was not created properly");
    }

    const profile = await userOperations.getUserProfile(testUser.id);
    expect(profile).toBeDefined();
    expect(profile.user_id).toBe(testUser.id);
  });

  test("upsertUserProfile should update an existing profile", async () => {
    if (!testUser) {
      throw new Error("Test user was not created properly");
    }

    const updatedProfile = await userOperations.upsertUserProfile(testUser.id, {
      name: "Updated Name",
      bio: "Updated bio information",
    });

    expect(updatedProfile).toBeDefined();
    expect(updatedProfile[0].name).toBe("Updated Name");
    expect(updatedProfile[0].bio).toBe("Updated bio information");
  });
});

// Clean up test data after all tests
afterAll(async () => {
  if (testUser) {
    try {
      // Delete test user profile
      await supabase.from("profiles").delete().eq("user_id", testUser.id);

      // Delete test user from auth
      await supabase.auth.admin.deleteUser(testUser.id);
    } catch (error) {
      console.error("Error cleaning up test data:", error);
    }
  }
});
