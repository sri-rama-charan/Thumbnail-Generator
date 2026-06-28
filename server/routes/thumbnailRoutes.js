/**
 * Purpose: Routing definitions for thumbnail and community feed endpoints.
 * 
 * Routes:
 * - GET /: Fetches the authenticated user's private generation library (Protected).
 * - DELETE /:id: Deletes a specific thumbnail created by the authenticated user (Protected).
 * - GET /community: Fetches public-visible feed thumbnails and trending titles (Public).
 * - POST /community/:id/like: Toggles like status on a public thumbnail (Protected).
 * - GET /proxy: Bypasses browser CORS restrictions to download images (Public).
 */

const express = require("express");
const {
  getUserThumbnails,
  deleteThumbnail,
  proxyThumbnailImage,
} = require("../controllers/thumbnailController");
const {
  getCommunityFeed,
  likeThumbnail,
} = require("../controllers/communityController");
const authMiddleware = require("../middleware/authMiddleware");

// Instantiate Express Router
const router = express.Router();

/**
 * Public Routes
 */
// Fetches public thumbnail gallery list and trending ideas
router.get("/community", getCommunityFeed);

// Proxies remote images to allow download triggers in the browser
router.get("/proxy", proxyThumbnailImage);

/**
 * Protected Routes
 */
// Fetches historical generations for the logged-in user
router.get("/", authMiddleware, getUserThumbnails);

// Deletes a user's thumbnail entry by document ID
router.delete("/:id", authMiddleware, deleteThumbnail);

// Toggles like status (add/remove) for a community card
router.post("/community/:id/like", authMiddleware, likeThumbnail);

// Export router instance
module.exports = router;
