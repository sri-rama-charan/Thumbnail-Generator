/**
 * Purpose: AI Generation Service.
 * 
 * Flow:
 * 1. Delegates prompt optimization parameters to Groq SDK helpers.
 * 2. Assembles final Pollinations draw URLs.
 * 3. Triggers image pre-warming fetches in the background to cache drawing results.
 */

const {
  optimizePrompt,
  buildImageUrl,
  warmImageUrl,
} = require("../utils/thumbnailHelpers");

/**
 * Orchestrates prompt optimization, image URL rendering, and warmup caching.
 * 
 * @param {Object} payload - User design configurations (title, style, colors, etc.)
 * @returns {Promise<Object>} - { optimizedPrompt, imageUrl } result details
 */
const generateThumbnailPrompt = async (payload) => {
  const { aspectRatio, sourceImage } = payload;

  // 1. Rewrite raw input into highly visual prompt configurations via Groq
  const optimizedPrompt = await optimizePrompt(payload);

  // 2. Assemble final generation endpoint URL
  const imageUrl = buildImageUrl(optimizedPrompt, aspectRatio, sourceImage);

  // 3. Force backend warmup fetch to pre-compile layout before sending to client
  await warmImageUrl(imageUrl);

  return {
    optimizedPrompt,
    imageUrl,
  };
};

module.exports = {
  generateThumbnailPrompt,
};
