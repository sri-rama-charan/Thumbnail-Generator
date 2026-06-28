/**
 * Purpose: User Business Logic Service.
 * 
 * Flow:
 * 1. Performs database reads/writes for User entities.
 * 2. Manages secure profile lookups, credit balance verifications, and credit deductions.
 */

const User = require("../models/User");

/**
 * Finds user by database document ID.
 * Excludes password field.
 * 
 * @param {string} id - Mongoose User ID
 * @returns {Promise<Object>} - User document
 */
const findUserById = async (id) => {
  return await User.findById(id).select("-password");
};

/**
 * Finds user by unique email index.
 * 
 * @param {string} email - Email address query
 * @returns {Promise<Object>} - User document containing hashed password
 */
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * Persists a new user record in the database.
 * 
 * @param {Object} userData - name, email, and already hashed password
 * @returns {Promise<Object>} - Saved user document
 */
const createUser = async ({ name, email, password }) => {
  return await User.create({
    name,
    email,
    password,
  });
};

/**
 * Verifies if user has remaining credits.
 * 
 * @param {string} userId - User document ID
 * @returns {Promise<boolean>} - True if credits > 0
 */
const hasSufficientCredits = async (userId) => {
  const user = await User.findById(userId);
  return user && user.credits > 0;
};

/**
 * Deducts 1 credit from the user's balance.
 * 
 * @param {string} userId - User document ID
 * @returns {Promise<number>} - Updated credits count
 */
const deductCredit = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User record not found");
  
  if (user.credits <= 0) {
    throw new Error("Insufficient credits");
  }

  user.credits -= 1;
  await user.save();
  return user.credits;
};

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  hasSufficientCredits,
  deductCredit,
};
