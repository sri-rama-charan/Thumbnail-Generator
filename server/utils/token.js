/**
 * Purpose: Centralized helper to generate JSON Web Tokens (JWT) for authentication.
 * 
 * Why this is used:
 * After a user successfully signs up or logs in, we need a secure way to verify 
 * subsequent API requests. We generate a token containing the user's database ID as the payload,
 * signed with a server-only JWT_SECRET. The client stores this token in localStorage 
 * and attaches it as an Authorization Bearer header.
 * 
 * Expiration: Tokens expire in 7 days ('7d') to balance security and convenience.
 */

const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT for the authenticated user.
 * 
 * @param {string} id - The MongoDB user ID (_id)
 * @returns {string} - The signed JWT string
 */
const generateToken = (id) => {
  // Signs payload { id } with JWT_SECRET and expiration options
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token valid for 7 days
  });
};

// Export token generation helper
module.exports = generateToken;
