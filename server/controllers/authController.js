/**
 * Purpose: Authentication Controller.
 * 
 * Flow:
 * 1. Coordinates user profile validation requests.
 * 2. Delegates database interactions to the underlying UserService layer.
 * 3. Signs and returns JWT session authorization keys.
 */

const bcrypt = require("bcryptjs");
const generateToken = require("../utils/token");
const userService = require("../services/userService");

/**
 * Register a new user account.
 * Route: POST /api/auth/signup
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide your name, email, and password.",
      });
    }

    // 2. Validate email uniqueness via userService
    const userExists = await userService.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    // 3. Encrypt the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create new user in database via userService
    const user = await userService.createUser({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Generate authorization token
    const token = generateToken(user._id);

    // 6. Return response containing token and user profile details
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Log in an existing user.
 * Route: POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password.",
      });
    }

    // 2. Locate user profile via userService
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 3. Verify user password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 4. Generate authorization token
    const token = generateToken(user._id);

    // 5. Return success payload containing token and user profile details
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch current user profile details.
 * Route: GET /api/auth/me
 */
const getProfile = async (req, res, next) => {
  try {
    // req.user was securely attached in authMiddleware after token verification
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        credits: req.user.credits,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getProfile,
};
