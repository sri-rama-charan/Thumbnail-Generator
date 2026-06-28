/**
 * Purpose: Defines the Thumbnail Mongoose Schema and Model.
 * This stores the metadata for each generated or recreated thumbnail, 
 * including prompt details, aspect ratio, style, palette, and ownership.
 * 
 * Fields:
 * - userId: References the User model (owner of the thumbnail).
 * - title: Title or main topic of the thumbnail.
 * - style: Visually descriptive style name (e.g. "Bold", "3D Render").
 * - aspectRatio: Standard video display ratio (e.g. "16:9", "1:1").
 * - colors: The chosen color palette details (typically an array or description).
 * - originalPrompt: User-provided descriptive input / supporting notes.
 * - optimizedPrompt: Visually rich, refined prompt produced by Groq.
 * - imageUrl: The final generated Pollinations image URL.
 * - mode: Distinguishes between 'generate' (from scratch) and 'recreate' (editing).
 * - sourceImage: Original reference image URL (applicable for recreate mode).
 * - changeRequest: Description of editing instructions (applicable for recreate mode).
 * - visibility: 'public' to show on community feed, 'private' to hide. Defaults to 'public'.
 * - likes: Total count of likes this thumbnail has received.
 * - likedBy: Array of User IDs who have liked this thumbnail (prevents duplicate likes).
 */

const mongoose = require("mongoose");

const thumbnailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner user ID is required"],
    },
    title: {
      type: String,
      required: [true, "Thumbnail title/topic is required"],
      trim: true,
    },
    style: {
      type: String,
      required: [true, "Style preset selection is required"],
    },
    aspectRatio: {
      type: String,
      required: [true, "Aspect ratio is required"],
      default: "16:9",
    },
    colors: {
      // Stored as mongoose Mixed to allow array of hex strings or simple string description
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Color palette configuration is required"],
    },
    originalPrompt: {
      type: String,
      default: "",
    },
    optimizedPrompt: {
      type: String,
      required: [true, "Optimized generation prompt is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Generated image URL is required"],
    },
    mode: {
      type: String,
      enum: ["generate", "recreate"],
      required: [true, "Generation mode (generate or recreate) is required"],
    },
    sourceImage: {
      type: String,
      default: "",
    },
    changeRequest: {
      type: String,
      default: "",
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    // Auto-adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Compile schema into model and export
const Thumbnail = mongoose.model("Thumbnail", thumbnailSchema);
module.exports = Thumbnail;
