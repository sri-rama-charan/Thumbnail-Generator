/**
 * Purpose: Global Client-side API fetch layer.
 * 
 * Flow:
 * 1. Checks if a JWT token is saved in localStorage (stored as 'thumblify_token').
 * 2. Assembles request headers, automatically injecting Content-Type: application/json 
 *    and the Authorization Bearer token header if the user is authenticated.
 * 3. Sends requests to the backend API base (VITE_API_URL).
 * 4. Resolves the response; if non-OK, extracts the backend error message and throws a standard JS Error.
 * 5. Exports unified wrapper functions for Auth, AI, and Thumbnail API calls.
 */

// Base URL resolves from environment variable or defaults to port 5000 in local dev
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Standardized HTTP fetch wrapper.
 * Handles header injection, response parsing, and error normalization.
 * 
 * @param {string} endpoint - API path (e.g., "/auth/login")
 * @param {Object} options - Request options (method, body, custom headers)
 * @returns {Promise<any>} - Resolved JSON response body
 */
const request = async (endpoint, options = {}) => {
  // Retrieve token from browser localStorage
  const token = localStorage.getItem("thumblify_token");

  // Construct request headers
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // Perform network request
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Extract JSON payload
  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    // If response does not contain JSON, fallback to empty object
    data = {};
  }

  // Handle non-2xx status codes
  if (!response.ok) {
    // Throw error with message returned by server, fallback to default status text
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

// Export organized API endpoint bindings
export const api = {
  // Authentication Bindings
  auth: {
    signup: (name, email, password) =>
      request("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }),
    login: (email, password) =>
      request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    getMe: () => request("/auth/me", { method: "GET" }),
  },

  // AI Generation Bindings
  ai: {
    generateThumbnail: (payload) =>
      request("/ai/generate-thumbnail", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  // Thumbnail Management Bindings
  thumbnails: {
    getUserLibrary: () => request("/thumbnails", { method: "GET" }),
    delete: (id) => request(`/thumbnails/${id}`, { method: "DELETE" }),
    getCommunityFeed: () => request("/thumbnails/community", { method: "GET" }),
    like: (id) => request(`/thumbnails/community/${id}/like`, { method: "POST" }),
  },
};
