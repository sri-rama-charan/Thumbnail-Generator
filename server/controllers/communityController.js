/**
 * Purpose: Controller for managing the public Community Feed and social interactions.
 * 
 * Flow:
 * 1. Coordinates public community feed queries and liking toggles.
 * 2. Delegates database operations to ThumbnailService.
 */

const thumbnailService = require("../services/thumbnailService");

// Curated list of trending topics returned to community feed for inspiration
const TRENDING_IDEAS = [
  "How I built a profitable SaaS in 24 hours using AI agents",
  "Why you are coding React components the wrong way",
  "I tried programming using ONLY my voice for 7 days",
  "Junior Developer vs AI Coding Agent: The Ultimate Showdown",
  "10 Clean Code tips every programmer must know in 2026",
];

/**
 * Fetch community feed (public thumbnails) and trending ideas.
 * Route: GET /api/thumbnails/community
 */
const getCommunityFeed = async (req, res, next) => {
  try {
    const thumbnails = await thumbnailService.getCommunityFeed();
    return res.status(200).json({
      success: true,
      thumbnails,
      ideas: TRENDING_IDEAS,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Likes or unlikes a public thumbnail.
 * Route: POST /api/thumbnails/community/:id/like
 */
const likeThumbnail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { likes, liked } = await thumbnailService.toggleLike(id, req.user._id);

    return res.status(200).json({
      success: true,
      likes,
      liked,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommunityFeed,
  likeThumbnail,
};
