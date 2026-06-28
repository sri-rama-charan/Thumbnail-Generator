/**
 * Purpose: Express Application Entry Point.
 * 
 * Responsibilities:
 * 1. Loads configuration from .env variables via 'dotenv'.
 * 2. Initializes connection to MongoDB Atlas database.
 * 3. Builds and configures the Express application instance.
 * 4. Mounts global middlewares (CORS, Morgan logger, JSON body parser).
 * 5. Integrates sub-routes (Auth, Health, and eventually AI/Thumbnails in future phases).
 * 6. Implements a centralized error handling middleware to gracefully respond to system exceptions.
 * 7. Starts listening to incoming TCP requests on the specified port.
 */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables before doing anything else
dotenv.config();

// Create Express application instance
const app = express();

// Establish connection to MongoDB Atlas cluster
connectDB();

/**
 * Configure Global Middlewares
 */

// Configure Cross-Origin Resource Sharing (CORS)
// Allows communication from the client React app (CLIENT_URL) and passes session cookies/headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// HTTP request logger in 'dev' format (logs methods, URLs, status codes, and latency to stdout)
app.use(morgan("dev"));

// Body parser: extracts JSON data from incoming request payloads and binds it to req.body
app.use(express.json());

/**
 * Mount Route Handlers
 */

// Mount Authentication module routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Mount AI Generation module routes
const aiRoutes = require("./routes/aiRoutes");
app.use("/api/ai", aiRoutes);

// Mount Thumbnail management module routes
const thumbnailRoutes = require("./routes/thumbnailRoutes");
app.use("/api/thumbnails", thumbnailRoutes);


// Health check endpoint used to verify server availability and connectivity
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Thumblify Server is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Centralized Error Handling Middleware
 * Captures all express throw statements or async handler next(error) invocations
 */
app.use((err, req, res, next) => {
  // Log full stack trace in development console for debugging
  console.error("Centralized Error Handler triggered:");
  console.error(err.stack || err);

  // Set appropriate status code (default to 500 Internal Server Error)
  const statusCode = err.status || 500;

  // Send uniform JSON error response structure back to the client
  return res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected system error occurred on the server.",
  });
});

/**
 * Start Express TCP Server
 */
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "127.0.0.1"; // Defaults to localhost to bypass firewall alerts

app.listen(PORT, HOST, () => {
  console.log(`===================================================`);
  console.log(`🚀 Server running in local development mode`);
  console.log(`📡 URL: http://${HOST}:${PORT}`);
  console.log(`===================================================`);
});
