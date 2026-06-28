/**
 * Purpose: Routing definitions for AI-based thumbnail generation requests.
 * 
 * Routes:
 * - POST /generate-thumbnail: Protected route that triggers prompt optimization, 
 *   image generation url construction, pre-warming, Mongoose thumbnail creation, 
 *   and user credit deduction.
 */

const express = require("express");
const { generateThumbnail } = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");

// Instantiate Express Router
const router = express.Router();

/**
 * Protected Routes
 */
// Maps POST /api/ai/generate-thumbnail to the generateThumbnail controller.
// Protected by authMiddleware to enforce credit deductions and verify logged-in status.
router.post("/generate-thumbnail", authMiddleware, generateThumbnail);

// Export router instance
module.exports = router;
