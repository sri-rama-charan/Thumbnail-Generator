/**
 * Purpose: Defines the User Mongoose Schema and Model.
 * This represents users of Thumblify, including credentials, profiles, 
 * and their dynamic thumbnail generation credits.
 * 
 * Fields:
 * - name: Display name of the user.
 * - email: Unique user login identifier, normalized to lowercase.
 * - password: Securely stored bcrypt-hashed password string.
 * - credits: Current remaining credits (starts at 15 for new users).
 * - timestamps: Automatically tracks 'createdAt' and 'updatedAt'.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define user database schema rules
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // Removes leading and trailing whitespace
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Prevents multiple accounts under the same email
      trim: true,
      lowercase: true, // Automatically normalizes emails to lowercase
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    credits: {
      type: Number,
      default: 15, // New users start with 15 free thumbnail generation credits
      min: [0, "Credits cannot be negative"],
    },
  },
  {
    // Auto-adds createdAt and updatedAt fields
    timestamps: true,
  }
);

/**
 * Method: matchPassword
 * Compares a plaintext candidate password with the stored hashed password.
 * 
 * @param {string} enteredPassword - Plaintext password input from login request
 * @returns {Promise<boolean>} - True if match succeeds, false otherwise
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Uses bcryptjs comparison algorithm to verify passwords
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compile schema into a model and export
const User = mongoose.model("User", userSchema);
module.exports = User;
