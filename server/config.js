import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const BLEND_AI_API_URL = process.env.BLEND_AI_API_URL || "";
export const BLEND_AI_API_KEY = process.env.BLEND_AI_API_KEY || "";
export const OPENAI_API_URL = process.env.OPENAI_API_URL || "";
export const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY || "";
