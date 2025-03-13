import cron from "node-cron";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import supabase from "./providers/supabase.js";

dotenv.config();

const BLEND_AI_API_URL = "https://api.bland.ai/v1/calls";
const BLEND_AI_API_KEY = "";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPEN_AI_API_KEY = "";

// Initialize express server
const server = express();
const PORT = process.env.PORT || 5000;

// Middleware
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.post("/api/tasks", async (req, res) => {
  try {
    const { id, email, body, is_reminder, remind_date } = req.body;

    if (!email || !body) {
      return res.status(400).json({ error: "Email and task body are required" });
    }

    const user_id = id;

    // Insert task into the database
    const { data, error } = await supabase.from("tasks").insert([{ user_id, body, is_reminder, remind_date }]).select();

    if (error) {
      throw error;
    }

    res.status(201).json({ message: "Task added successfully", task: data[0] });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Failed to add task", details: error.message });
  }
});

server.get("/api/tasks", async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    // Fetch all tasks for the user
    const { data: tasks, error } = await supabase.from("tasks").select("*").eq("user_id", user_id);

    if (error) {
      throw error;
    }

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
});

// Schedule the task to run every minute
cron.schedule("* * * * *", async () => {
  console.log("Running scheduler task every minute");

  try {
    const blendResponse = await fetch(BLEND_AI_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BLEND_AI_API_KEY}`, // Add authorization if needed
      },
    });

    if (!blendResponse.ok) {
      console.error(`BlendAI API request failed: ${blendResponse.statusText}`);
    } else {
      const blendData = await blendResponse.json();
      const calls = blendData.calls || []; // Assuming calls is an array in the response
      for (const call of calls) {
        if (!call.summary) {
          console.warn(`Call ${call.id} has no summary. Skipping.`);
          continue;
        }

        // Check if phone number is in profiles table
        const phoneNumber = call.from; // Assuming 'from' field has phone number
        if (!phoneNumber) {
          console.warn(`Call ${call.id} has no phone number. Skipping.`);
          continue;
        }

        // Check if phone number exists in profiles table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("phone_number", phoneNumber);

        if (profileError) {
          console.error("Error checking profile:", profileError);
          continue;
        }

        if (!profileData || profileData.length === 0) {
          console.log(`Phone number ${phoneNumber} not found in profiles. Skipping.`);
          continue; // Skip processing if phone number not found
        }

        console.log(`Processing call summary: ${call.summary}`);

        const openaiResponse = await fetch(OPENAI_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPEN_AI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo", // Or any suitable model
            messages: [
              {
                role: "user",
                content: `Provide a JSON object for the following call summary, fitting the tasks table structure: ${call.summary}. The table has the following structure: CREATE TABLE tasks (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE, body TEXT NOT NULL, is_reminder BOOLEAN NOT NULL DEFAULT FALSE, date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), remind_date TIMESTAMP WITH TIME ZONE DEFAULT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()); only return the json object.`,
              },
            ],
          }),
        });

        if (!openaiResponse.ok) {
          console.error(`OpenAI API request failed: ${openaiResponse.statusText}`);
          const openaiResponseBody = await openaiResponse.text();
          console.error("OpenAI API response body:", openaiResponseBody);
          continue; // Continue to the next call
        }

        const openaiData = await openaiResponse.json();
        const chatgptResponse = openaiData.choices[0].message.content;

        try {
          const taskData = JSON.parse(chatgptResponse);
          // Assuming taskData has user_id, body, is_reminder, remind_date
          const { body, is_reminder, remind_date } = taskData;

          // Assuming 'call.from' contains the phone number
          const phoneNumber = call.from;

          if (!phoneNumber) {
            console.warn("Call has no phone number to identify user.");
            return; // Stop processing this call
          }

          const user_id = profileData[0].user_id;

          // Check if task already exists
          const { data: existingTasks, error: existingTasksError } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", user_id)
            .eq("body", body);

          if (existingTasksError) {
            console.error("Error checking existing tasks:", existingTasksError);
            continue;
          }

          if (existingTasks && existingTasks.length > 0) {
            console.log("Task already exists. Skipping insertion.");
            continue; // Skip insertion if task exists
          }

          console.log("Parsed task data:", taskData);

          // Insert task into Supabase
          const { error: supabaseError } = await supabase
            .from("tasks")
            .insert([{ user_id, body, is_reminder, remind_date }]);

          if (supabaseError) {
            console.error("Supabase insert error:", supabaseError);
          } else {
            console.log("Task inserted successfully.");
          }
        } catch (jsonError) {
          console.error("Error parsing ChatGPT response:", jsonError);
          console.error("ChatGPT response:", chatgptResponse);
        }
      }
    }
  } catch (error) {
    console.error(`Error sending scheduler request for user:`, error);
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
