/**
 * Purpose: Thumbnail Display Card component.
 * 
 * Flow:
 * 1. Renders the thumbnail image with a hover visual layout overlay.
 * 2. Visual overlays show design parameters: Style, Palette, and the AI optimized prompt.
 * 3. Client-side download handler retrieves the image through the CORS proxy.
 * 4. Action buttons:
 *    - Recreate: Redirects user to /generate, pre-loading layout settings in state.
 *    - Copy URL: Copies the raw image URL to the clipboard.
 *    - Download: Saves the file locally.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resolveThumbnailUrl, resolveDownloadUrl } from "../utils/thumbnailUrls";
import { useAuth } from "../context/AuthContext";

const ThumbnailCard = ({
  item,
  onDelete,
  onLike,
  showDelete = false,
  showLike = false,
  showAuthor = false,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check if current logged-in user liked this thumbnail
  const isLikedByMe = user && item.likedBy && item.likedBy.includes(user.id || user._id);

  /**
   * Redirects user to Studio, pre-loading reference parameters in state
   */
  const handleRecreateClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/generate", { state: { reference: item } });
  };

  /**
   * Copies the AI optimized prompt to the clipboard
   */
  const handleCopyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(item.optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };



  /**
   * Downloads the image through the CORS proxy
   */
  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (downloading) return;

    setDownloading(true);
    try {
      const proxyUrl = resolveDownloadUrl(item.imageUrl);
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("CORS Proxy retrieval returned failure");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const tempLink = document.createElement("a");
      tempLink.href = blobUrl;
      const sanitizedTitle = item.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
      tempLink.download = `${sanitizedTitle || "thumblify"}-thumbnail.jpg`;
      
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Image download script crashed:", err);
      alert("Failed to download image. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-slate-900/20 shadow-lg transition-all duration-300 hover:border-brand-pink/20 hover:shadow-xl hover:shadow-brand-pink/5"
      onMouseEnter={() => setShowMetadata(true)}
      onMouseLeave={() => setShowMetadata(false)}
    >
      {/* 1. Image viewport wrapper */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={resolveThumbnailUrl(item.imageUrl)}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Creation Mode Badge */}
        <span className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-md select-none ${
          item.mode === "recreate"
            ? "bg-brand-purple text-white border border-brand-purple/30"
            : "bg-brand-pink text-white border border-brand-pink/30"
        }`}>
          {item.mode}
        </span>

        {/* Metadata info hover screen overlay */}
        <div className={`absolute inset-0 bg-slate-950/85 p-4 flex flex-col justify-between transition-opacity duration-300 ${
          showMetadata ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>
          {/* Style & Palette summary */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-pink select-none">
              Design Configuration
            </span>
            <p className="text-xs text-white font-semibold">Style: <span className="text-slate-300 font-normal">{item.style}</span></p>
            <p className="text-xs text-white font-semibold">Palette: <span className="text-slate-300 font-normal">{item.colors}</span></p>
          </div>

          {/* AI optimized prompt description */}
          <div className="border-t border-white/5 pt-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-purple select-none">
              AI Optimized Prompt
            </span>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-300 line-clamp-4 select-text">
              "{item.optimizedPrompt}"
            </p>
          </div>
        </div>
      </div>

      {/* 2. Text Content & Action Toolbar */}
      <div className="flex flex-col gap-3 p-4">
        {/* Title & Author */}
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white truncate" title={item.title}>
            {item.title}
          </h4>
          {showAuthor && item.userId && (
            <p className="text-[11px] text-slate-500 mt-0.5 truncate select-none">
              Created by <span className="text-slate-400 font-medium">{item.userId.name || "Creator"}</span>
            </p>
          )}
        </div>

        {/* Button toolbar */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          {/* Like controls */}
          {showLike ? (
            <button
              onClick={() => onLike && onLike(item._id)}
              className={`flex items-center gap-1.5 text-xs transition cursor-pointer select-none ${
                isLikedByMe ? "text-brand-pink font-semibold" : "text-slate-400 hover:text-white"
              }`}
            >
              <svg
                className={`h-4.5 w-4.5 ${isLikedByMe ? "fill-brand-pink" : "fill-none"}`}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{item.likes || 0}</span>
            </button>
          ) : (
            <div />
          )}
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Copy button */}
            <button
              onClick={handleCopyClick}
              className={`rounded-lg p-1 transition cursor-pointer ${
                copied ? "text-emerald-400 bg-emerald-500/10" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
              }`}
              title={copied ? "Copied!" : "Copy Optimized Prompt"}
            >
              {copied ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                // Clipboard Doc copy icon (for prompt copy)
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )}
            </button>



            {/* Recreate button */}
            <button
              onClick={handleRecreateClick}
              className="rounded-lg p-1 text-slate-500 hover:bg-brand-purple/10 hover:text-brand-purple transition cursor-pointer"
              title="Use as Reference (Recreate)"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
              </svg>
            </button>

            {/* Download file button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300 hover:bg-white/10 hover:text-white transition disabled:opacity-50 cursor-pointer"
            >
              {downloading ? (
                <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              <span>{downloading ? "Saving" : "Download"}</span>
            </button>

            {/* Trash deletion icon */}
            {showDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Are you sure you want to permanently delete this thumbnail concept?")) {
                    onDelete && onDelete(item._id);
                  }
                }}
                className="rounded-lg p-1 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition cursor-pointer"
                title="Delete Thumbnail"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ThumbnailCard;
