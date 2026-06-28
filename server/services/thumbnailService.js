/**
 * Purpose: Thumbnail Business Logic Service.
 * 
 * Flow:
 * 1. Performs database CRUD transactions on Thumbnail documents.
 * 2. Validates deletion authorization before removing files.
 * 3. Populates creator profiles on community feed requests.
 * 4. Manages secure, atomic social liked toggle calculations.
 */

const Thumbnail = require("../models/Thumbnail");

/**
 * Persists a newly generated thumbnail record.
 * 
 * @param {Object} thumbnailData - Schema fields
 * @returns {Promise<Object>} - Saved Thumbnail document
 */
const createThumbnail = async (thumbnailData) => {
  return await Thumbnail.create(thumbnailData);
};

/**
 * Retrieves generations historical list for a given user.
 * 
 * @param {string} userId - Owner user ID
 * @returns {Promise<Array>} - List of thumbnails sorted newest first
 */
const getUserLibrary = async (userId) => {
  return await Thumbnail.find({ userId }).sort({ createdAt: -1 });
};

/**
 * Deletes a thumbnail from database. Enforces ownership authorization check.
 * 
 * @param {string} id - Thumbnail document ID
 * @param {string} userId - Requester User ID
 * @returns {Promise<boolean>} - True if deletion succeeded
 */
const deleteUserThumbnail = async (id, userId) => {
  const thumbnail = await Thumbnail.findById(id);
  if (!thumbnail) {
    const err = new Error("Thumbnail not found");
    err.status = 404;
    throw err;
  }

  // Authorize: check if user matches owner
  if (thumbnail.userId.toString() !== userId.toString()) {
    const err = new Error("Unauthorized deletion request");
    err.status = 403;
    throw err;
  }

  await thumbnail.deleteOne();
  return true;
};

/**
 * Retrieves public community feed thumbnails with creator names populated.
 * 
 * @returns {Promise<Array>} - List of public thumbnails sorted newest first
 */
const getCommunityFeed = async () => {
  return await Thumbnail.find({ visibility: "public" })
    .populate("userId", "name")
    .sort({ createdAt: -1 });
};

/**
 * Toggles user likes on a public thumbnail.
 * 
 * @param {string} id - Thumbnail ID
 * @param {string} userId - User ID liking the card
 * @returns {Promise<Object>} - { likes, liked } updated stats
 */
const toggleLike = async (id, userId) => {
  const thumbnail = await Thumbnail.findById(id);
  if (!thumbnail) {
    const err = new Error("Thumbnail not found");
    err.status = 404;
    throw err;
  }

  if (thumbnail.visibility !== "public") {
    const err = new Error("Cannot like a private thumbnail");
    err.status = 403;
    throw err;
  }

  const likeIndex = thumbnail.likedBy.indexOf(userId);
  let liked = false;

  if (likeIndex > -1) {
    // User already liked it, so unlike
    thumbnail.likedBy.splice(likeIndex, 1);
    thumbnail.likes = Math.max(0, thumbnail.likes - 1);
    liked = false;
  } else {
    // User has not liked yet, so like
    thumbnail.likedBy.push(userId);
    thumbnail.likes += 1;
    liked = true;
  }

  await thumbnail.save();
  return {
    likes: thumbnail.likes,
    liked,
  };
};

module.exports = {
  createThumbnail,
  getUserLibrary,
  deleteUserThumbnail,
  getCommunityFeed,
  toggleLike,
};
