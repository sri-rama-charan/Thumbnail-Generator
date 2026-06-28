/**
 * Purpose: Authentication middleware for protecting private Express routes.
 * 
 * Flow:
 * 1. Checks if the request headers contain an 'Authorization' field.
 * 2. Verifies that the header format starts with 'Bearer '.
 * 3. Decodes the token using the system's JWT_SECRET to extract the user ID.
 * 4. Queries the MongoDB database to find the user associated with that ID.
 * 5. Excludes the password field from the database query for security.
 * 6. Attaches the found user document to 'req.user' so subsequent handlers can access it.
 * 7. Calls next() if all checks pass, otherwise returns a 401 Unauthorized response.
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Express middleware to authenticate incoming JWT tokens.
 */
const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // 1. Get the Authorization header from request headers
    const authHeader = req.headers.authorization;

    // 2. Validate authorization format (Bearer <token>)
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Extract token string by splitting the header value at the space
      token = authHeader.split(" ")[1];
    }

    // If token is missing, reject the request with 401 Unauthorized
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No authentication token provided.",
      });
    }

    // 3. Verify the token signature and integrity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Fetch the user document by ID, excluding the password field
    const user = await User.findById(decoded.id).select("-password");

    // 5. If user is not found, reject request
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Authorization failed.",
      });
    }

    // 6. Attach the user object to the request context
    req.user = user;

    // Proceed to the next middleware or final route controller
    next();
  } catch (error) {
    // If token verification fails (expired, invalid secret, etc.)
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please log in again.",
    });
  }
};

module.exports = authMiddleware;
