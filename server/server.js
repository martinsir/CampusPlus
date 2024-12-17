import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import apiRoutes from "./routes/api.js"; // API routes

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "./.env") });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS: Allow development and production domains
const allowedOrigins = [
  "http://localhost:5173", // Development
  "http://two.itloesninger.dk", // Production
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// Debug Middleware (Optional for production)
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  next();
});

// Serve static files from Vite build folder
app.use(express.static(path.join(__dirname, "../dist")));

// API Routes
app.use("/api", apiRoutes);

// Catch-all route for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// Default 404 for invalid API routes
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
