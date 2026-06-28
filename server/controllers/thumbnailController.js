/**
 * Purpose: Controller for managing personal user Thumbnails.
 * 
 * Flow:
 * 1. Coordinates private history lists, download streams, and file deletion requests.
 * 2. Delegates database queries to ThumbnailService.
 * 3. Streams external pollinations images through local express pipelines.
 */

const thumbnailService = require("../services/thumbnailService");

const ALLOWED_IMAGE_HOSTS = new Set([
  "image.pollinations.ai",
  "pollinations.ai",
]);

/**
 * Fetch thumbnails created by the authenticated user.
 * Route: GET /api/thumbnails
 */
const getUserThumbnails = async (req, res, next) => {
  try {
    const thumbnails = await thumbnailService.getUserLibrary(req.user._id);
    return res.status(200).json({
      success: true,
      thumbnails,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a user-owned thumbnail document.
 * Route: DELETE /api/thumbnails/:id
 */
const deleteThumbnail = async (req, res, next) => {
  try {
    const { id } = req.params;
    await thumbnailService.deleteUserThumbnail(id, req.user._id);
    
    return res.status(200).json({
      success: true,
      message: "Thumbnail deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Proxy route to bypass CORS issues on browser client downloads.
 * Route: GET /api/thumbnails/proxy
 */
const proxyThumbnailImage = async (req, res, next) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "Query parameter 'url' is required.",
      });
    }

    // 1. Verify hostname whitelist for security
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace("www.", "");
    
    if (!ALLOWED_IMAGE_HOSTS.has(hostname)) {
      return res.status(400).json({
        success: false,
        message: "Forbidden host. Proxying is restricted to pollinations.ai domains.",
      });
    }

    // 2. Fetch the remote image from Pollinations
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) {
      return res.status(imageResponse.status).json({
        success: false,
        message: `Failed to fetch source image: ${imageResponse.statusText}`,
      });
    }

    // 3. Extract content type and forward to client
    const contentType = imageResponse.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return res.send(buffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserThumbnails,
  deleteThumbnail,
  proxyThumbnailImage,
};
