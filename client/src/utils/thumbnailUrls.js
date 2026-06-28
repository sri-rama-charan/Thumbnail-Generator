/**
 * Purpose: Frontend Image URL Resolver Utility.
 * 
 * Flow:
 * 1. resolveThumbnailUrl: Used for standard <img> tags. Allows rendering images 
 *    directly from whitelisted domains (like pollinations.ai) to bypass backend bandwidth overhead.
 * 2. resolveDownloadUrl: Used for downloads. Forces routing requests through the backend proxy 
 *    endpoint (/api/thumbnails/proxy) to bypass browser CORS restrictions and enable direct downloading.
 */

// Resolves backend API URL base from env configurations
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Resolves standard image URL for browser rendering.
 * 
 * @param {string} imageUrl - Original database image URL
 * @returns {string} - Resolved image source URL
 */
export const resolveThumbnailUrl = (imageUrl) => {
  if (!imageUrl) return "";
  // Check if it's already an absolute HTTP/HTTPS URL
  const isAbsolute = /^https?:\/\//i.test(imageUrl);
  if (!isAbsolute) {
    // If relative path, prepend API server host prefix
    return `${API_BASE_URL.replace("/api", "")}${imageUrl}`;
  }
  return imageUrl;
};

/**
 * Resolves image URL specifically for client-side download actions.
 * Wraps the remote URL into our backend proxy endpoint to circumvent browser CORS blocks.
 * 
 * @param {string} imageUrl - Original remote image URL
 * @returns {string} - Proxied URL string
 */
export const resolveDownloadUrl = (imageUrl) => {
  if (!imageUrl) return "";
  // Route through backend proxy utility
  return `${API_BASE_URL}/thumbnails/proxy?url=${encodeURIComponent(imageUrl)}`;
};
