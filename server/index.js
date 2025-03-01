const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

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

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
