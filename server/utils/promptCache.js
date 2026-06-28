/**
 * Purpose: Custom In-Memory Cache to store optimized AI prompts.
 * 
 * Why this is used:
 * Prompt optimization via Groq LLM requires API roundtrips and costs performance/tokens.
 * If a user sends the exact same parameters (topic, style, colors, extra prompt, etc.) 
 * multiple times, we can skip the Groq call and return the cached optimized prompt.
 * 
 * Structure:
 * - Uses a standard JavaScript Map: key (JSON string of parameters) -> value (optimized prompt string)
 * - Helper functions:
 *    - buildCacheKey: normalizes inputs into a stable JSON string.
 *    - getCachedPrompt: retrieves a cached prompt.
 *    - setCachedPrompt: saves an optimized prompt to the cache.
 */

// Instantiate a Map to hold cache key-value pairs during server lifetime
const promptCache = new Map();

/**
 * Builds a stable stringified JSON key from the prompt payload inputs.
 * 
 * @param {Object} payload - User inputs for thumbnail generation
 * @returns {string} - Deterministic JSON string cache key
 */
const buildCacheKey = (payload) => {
  return JSON.stringify({
    version: 2, // Version allows clearing caches when structure updates
    title: payload.title || "",
    style: payload.style || "",
    colors: payload.colors || "",
    aspectRatio: payload.aspectRatio || "",
    extraPrompt: payload.extraPrompt || payload.originalPrompt || "",
    sourceImage: payload.sourceImage || "",
    changeRequest: payload.changeRequest || "",
    mode: payload.mode || "generate",
  });
};

/**
 * Retrieves a cached optimized prompt if it exists.
 * 
 * @param {Object} payload - Request payload
 * @returns {string|null} - Cached optimized prompt, or null if not found
 */
const getCachedPrompt = (payload) => {
  const key = buildCacheKey(payload);
  const match = promptCache.get(key);
  if (match) {
    console.log("⚡ [Cache Hit] Reusing existing optimized prompt from cache.");
    return match;
  }
  return null;
};

/**
 * Saves a newly optimized prompt to the cache.
 * 
 * @param {Object} payload - Original request payload
 * @param {string} optimizedPrompt - The prompt output from Groq
 */
const setCachedPrompt = (payload, optimizedPrompt) => {
  const key = buildCacheKey(payload);
  promptCache.set(key, optimizedPrompt);
  console.log("💾 [Cache Store] Saved optimized prompt to cache.");
};

// Export cache functions
module.exports = {
  getCachedPrompt,
  setCachedPrompt,
};
