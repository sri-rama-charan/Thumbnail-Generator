/**
 * Purpose: Routing definitions for user authentication requests.
 * 
 * Routes:
 * - POST /signup: Public route to create a new user profile.
 * - POST /login: Public route to authenticate an existing user.
 * - GET /me: Protected route using authMiddleware to fetch active user profile information.
 */

const express = require("express");
const { signup, login, getProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Instantiate an Express Router to isolate routes mapping
const router = express.Router();

/**
 * Public Routes
 */
// Maps POST /api/auth/signup to the signup handler
router.post("/signup", signup);

// Maps POST /api/auth/login to the login handler
router.post("/login", login);

/**
 * Protected Routes
 */
// Maps GET /api/auth/me to the getProfile handler, guarded by token validation middleware
router.get("/me", authMiddleware, getProfile);

// Export router instance
module.exports = router;
