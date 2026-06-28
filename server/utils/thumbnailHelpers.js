/**
 * Purpose: AI Helpers for prompt optimization and Pollinations image url building.
 * 
 * Functions:
 * 1. optimizePrompt: Uses Groq SDK to rewrite raw user input into visually rich, 
 *    effective thumbnail generation prompts. Falls back to string assembly if Groq is offline.
 * 2. buildImageUrl: Assembles the final Pollinations generation URL with parameters 
 *    (prompt, width, height, nologo, and optionally reference image if recreate).
 * 3. normalizeSourceImageUrl: Cleans and trims the reference image URL.
 * 4. canUseSourceImageForGeneration: Validates if the reference image URL host 
 *    is in the allowed whitelist (image.pollinations.ai, pollinations.ai) to avoid security risks.
 * 5. warmImageUrl: Pings the Pollinations URL with a GET request on the backend 
 *    to trigger and cache the image generation before returning to the user.
 */

const Groq = require("groq-sdk");
const { getCachedPrompt, setCachedPrompt } = require("./promptCache");

// Allowed image reference hosts for security validation
const SUPPORTED_REFERENCE_IMAGE_HOSTS = new Set([
  "image.pollinations.ai",
  "pollinations.ai",
]);

// Initialize the Groq SDK client if the API key is present in environment variables
const groqClient = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

/**
 * Normalizes a URL by trimming surrounding spaces.
 * 
 * @param {string} url - Raw URL string
 * @returns {string} - Cleaned URL
 */
const normalizeSourceImageUrl = (url) => {
  if (!url) return "";
  return url.trim();
};

/**
 * Validates if the reference image host is supported.
 * Only allows domains specified in SUPPORTED_REFERENCE_IMAGE_HOSTS.
 * 
 * @param {string} url - Image URL to validate
 * @returns {boolean} - True if allowed, false otherwise
 */
const canUseSourceImageForGeneration = (url) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    // Remove "www." prefix to simplify comparison
    const hostname = parsed.hostname.replace("www.", "");
    return SUPPORTED_REFERENCE_IMAGE_HOSTS.has(hostname);
  } catch (error) {
    // If URL parsing fails, reject it as invalid
    return false;
  }
};

/**
 * Communicates with the Groq API to rewrite user thumbnail ideas into visually descriptive prompts.
 * If Groq is unconfigured or fails, returns a cleaned concatenated fallback string.
 * 
 * @param {Object} payload - User options (title, style, colors, extraPrompt, etc.)
 * @returns {Promise<string>} - The optimized visual prompt
 */
const optimizePrompt = async (payload) => {
  // 1. Check if the prompt has already been optimized and cached
  const cached = getCachedPrompt(payload);
  if (cached) {
    return cached;
  }

  const { title, style, colors, extraPrompt, changeRequest, mode } = payload;

  // Fallback prompt assembly in case Groq is unavailable
  const buildFallback = () => {
    let base = `${title || "Thumbnail concept"}. Style: ${style || "Bold"}. Palette: ${colors || "vibrant"}.`;
    if (mode === "recreate") {
      base += ` Change Request: ${changeRequest || "make adjustments"}.`;
    } else if (extraPrompt) {
      base += ` Details: ${extraPrompt}.`;
    }
    return base;
  };

  // If Groq client was not initialized, use the fallback prompt format
  if (!groqClient) {
    console.warn("⚠️ Groq SDK client not configured. Using standard prompt fallback.");
    const fallback = buildFallback();
    setCachedPrompt(payload, fallback);
    return fallback;
  }

  try {
    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "recreate") {
      // Recreate Mode optimization prompt
      systemPrompt = 
        "You are an expert YouTube thumbnail designer prompt engineer. " +
        "The user has an existing thumbnail concept and wants to apply a specific change request. " +
        "Generate a complete, visually striking, detailed image prompt that blends the original concept with the requested change. " +
        "Incorporate subject description, environment context, lighting, style preset, and color palette. " +
        "Respond with ONLY the final optimized image prompt. Do not write introductory text, quotes, or explanations.";

      userPrompt = `Original Topic: "${title}"\nStyle Preset: "${style}"\nColor Palette: "${colors}"\nChange Request: "${changeRequest}"`;
    } else {
      // Generate Mode optimization prompt
      systemPrompt = 
        "You are an expert YouTube thumbnail designer prompt engineer. " +
        "Rewrite the user's raw topic and style choices into a highly descriptive, visually punchy prompt for an AI image generator (like Stable Diffusion or Flux). " +
        "Focus on defining: subject layout, facial expressions, foreground objects, background elements, lighting style, and camera angle. " +
        "Ensure the text is optimized for creating highly clickable YouTube thumbnails. " +
        "Respond with ONLY the final optimized image prompt. Do not write introductory text, quotes, or explanations.";

      userPrompt = `Topic/Topic Concept: "${title}"\nStyle Preset: "${style}"\nColor Palette: "${colors}"\nSupporting Details: "${extraPrompt || "none"}"`;
    }

    console.log(`🤖 Requesting prompt optimization from Groq model: ${process.env.GROQ_MODEL || "llama-3.3-70b-versatile"}`);
    
    // Call the Groq SDK Chat Completion endpoint
    const response = await groqClient.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 150, // Keep prompts concise and highly punchy
      temperature: 0.7, // Balances creativity and structure
    });

    const optimizedResult = response.choices[0].message.content.trim();
    
    // Clean potential markdown quotes or backticks if returned by the LLM
    const cleanedResult = optimizedResult.replace(/^["'`]|["'`]$/g, "");

    // Save to promptCache
    setCachedPrompt(payload, cleanedResult);

    return cleanedResult;
  } catch (error) {
    console.error("❌ Groq API prompt optimization failed:", error.message);
    const fallback = buildFallback();
    setCachedPrompt(payload, fallback);
    return fallback;
  }
};

/**
 * Constructs the Pollinations AI image generation URL.
 * Maps standard video aspect ratios to actual pixel dimensions.
 * 
 * @param {string} prompt - The optimized prompt string
 * @param {string} aspectRatio - e.g. "16:9", "1:1", "9:16"
 * @param {string} sourceImage - Reference image URL (if recreate mode)
 * @returns {string} - Complete Pollinations URL
 */
const buildImageUrl = (prompt, aspectRatio, sourceImage = "") => {
  // Map aspect ratio to pixel dimensions (YouTube default is 1280x720)
  let width = 1280;
  let height = 720;

  if (aspectRatio === "1:1") {
    width = 1024;
    height = 1024;
  } else if (aspectRatio === "9:16") {
    width = 720;
    height = 1280;
  } else if (aspectRatio === "4:3") {
    width = 1024;
    height = 768;
  }

  // Double encode prompt to ensure special characters don't break the URI path mapping
  const encodedPrompt = encodeURIComponent(prompt);
  
  // Base Pollinations Image API URL
  let url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&model=flux`;

  // Attach reference image if provided and valid
  if (sourceImage && canUseSourceImageForGeneration(sourceImage)) {
    const encodedSource = encodeURIComponent(sourceImage);
    url += `&image=${encodedSource}`;
  }

  return url;
};

/**
 * Triggers a GET request to the generated Pollinations URL from the backend.
 * This pre-warms the CDN cache so that when the frontend renders the image, 
 * it is already generated and displays instantly.
 * 
 * @param {string} url - Pollinations image URL
 * @returns {Promise<boolean>} - True if warming succeeded
 */
const warmImageUrl = async (url) => {
  try {
    console.log(`🔥 Pre-warming Pollinations AI image: ${url}`);
    
    // Perform fetch request on backend to initiate AI model drawing
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20-second timeout
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      console.log(`✅ Pre-warm complete. Image status: ${response.status}`);
      return true;
    } else {
      console.warn(`⚠️ Pre-warm returned warning code: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error("❌ Pre-warming failed or timed out:", error.message);
    return false;
  }
};

module.exports = {
  normalizeSourceImageUrl,
  canUseSourceImageForGeneration,
  optimizePrompt,
  buildImageUrl,
  warmImageUrl,
};
