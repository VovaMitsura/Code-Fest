import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();
export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Authentication Middleware
export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "User is not authenticated" });

  const token = authHeader.split(" ")[1];
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (err) {
    console.error("Auth error: ", err);
    return res.status(401).json({ error: "Authentication failed" });
  }
};
