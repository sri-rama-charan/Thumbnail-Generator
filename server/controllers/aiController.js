/**
 * Purpose: AI Generation Controller.
 * 
 * Flow:
 * 1. Coordinates user graphic generation queries.
 * 2. Connects credit limit checks, prompt caching/rendering layers, database record insertion, 
 *    and balance deductions through corresponding UserService, AiService, and ThumbnailService instances.
 */

const {
  normalizeSourceImageUrl,
  canUseSourceImageForGeneration,
} = require("../utils/thumbnailHelpers");
const userService = require("../services/userService");
const aiService = require("../services/aiService");
const thumbnailService = require("../services/thumbnailService");

/**
 * Handles generating or recreating a thumbnail.
 * Route: POST /api/ai/generate-thumbnail
 */
const generateThumbnail = async (req, res, next) => {
  try {
    const user = req.user;

    // 1. Verify credit balances via userService
    const hasCredits = await userService.hasSufficientCredits(user._id);
    if (!hasCredits) {
      return res.status(403).json({
        success: false,
        message: "You have run out of generation credits. Please buy or request more credits.",
      });
    }

    // Extract fields
    const {
      title,
      style,
      aspectRatio,
      colors,
      extraPrompt,
      sourceImage,
      changeRequest,
      mode,
      visibility,
    } = req.body;

    const activeMode = mode === "recreate" ? "recreate" : "generate";

    // 2. Validate input parameters
    if (!title || !style || !aspectRatio || !colors) {
      return res.status(400).json({
        success: false,
        message: "Missing required generation fields: title, style, aspectRatio, and colors are required.",
      });
    }

    let cleanSourceImage = "";

    if (activeMode === "recreate") {
      if (!changeRequest || !sourceImage) {
        return res.status(400).json({
          success: false,
          message: "Recreating a thumbnail requires providing both a changeRequest and a sourceImage URL.",
        });
      }

      cleanSourceImage = normalizeSourceImageUrl(sourceImage);

      if (!canUseSourceImageForGeneration(cleanSourceImage)) {
        return res.status(400).json({
          success: false,
          message: "Unsupported reference image source. Reference images must be hosted on pollinations.ai.",
        });
      }
    }

    // 3. Orchestrate prompt optimization and drawing URL via aiService
    const { optimizedPrompt, imageUrl } = await aiService.generateThumbnailPrompt({
      title,
      style,
      colors,
      aspectRatio,
      extraPrompt: extraPrompt || "",
      sourceImage: cleanSourceImage,
      changeRequest: changeRequest || "",
      mode: activeMode,
    });

    // 4. Save record via thumbnailService
    const thumbnail = await thumbnailService.createThumbnail({
      userId: user._id,
      title,
      style,
      aspectRatio,
      colors,
      originalPrompt: activeMode === "recreate" ? changeRequest : (extraPrompt || ""),
      optimizedPrompt,
      imageUrl,
      mode: activeMode,
      sourceImage: cleanSourceImage,
      changeRequest: activeMode === "recreate" ? changeRequest : "",
      visibility: visibility === "private" ? "private" : "public",
    });

    // 5. Deduct credit from user record via userService
    const remainingCredits = await userService.deductCredit(user._id);

    // 6. Return response
    return res.status(201).json({
      success: true,
      message: "Thumbnail generated successfully!",
      thumbnail,
      credits: remainingCredits,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateThumbnail,
};
