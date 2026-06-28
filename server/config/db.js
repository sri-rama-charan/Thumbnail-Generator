/**
 * Purpose: Establishes a connection to the MongoDB database using Mongoose.
 * This connection is essential for persisting user profiles and generated thumbnails.
 * 
 * Flow:
 * 1. Imports the 'mongoose' library.
 * 2. Defines an asynchronous function 'connectDB'.
 * 3. Attempts to connect to MongoDB using the MONGO_URI environment variable.
 * 4. Exits the server process with failure code 1 if the database connection fails.
 */

const mongoose = require("mongoose");

/**
 * Establishes connection to MongoDB Atlas.
 * Utilizes the environment variable MONGO_URI.
 * If connection fails, the process is terminated.
 */
const connectDB = async () => {
  try {
    // Attempt database connection using URI from process environment
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // Log success message along with connection host for troubleshooting
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log detailed failure error message
    console.error(`MongoDB connection failed: ${error.message}`);
    
    // Exit application process with error code (1) to prevent running in half-broken state
    process.exit(1);
  }
};

// Export the connection helper function for use in main server entry point
module.exports = connectDB;
