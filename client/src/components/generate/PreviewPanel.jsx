/**
 * Purpose: Preview Panel component for Generation Studio.
 * 
 * Flow:
 * 1. Checks generating state: renders LoadingSpinner if active.
 * 2. Checks result payload:
 *    - Renders the image with retry triggers (onError) on draw failures.
 *    - Automatically handles cache busting parameters up to 3 times.
 *    - Renders optimized prompt description.
 * 3. Fallback: Renders a placeholder card if no generation exists.
 */

import React, { useState, useEffect } from "react";
import { resolveThumbnailUrl } from "../../utils/thumbnailUrls";
import LoadingSpinner from "../LoadingSpinner";

const PreviewPanel = ({ result, generating, setToast }) => {
  const [imgSrc, setImgSrc] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Sync image source whenever a new thumbnail generation returns
  useEffect(() => {
    if (result && result.imageUrl) {
      setImgSrc(result.imageUrl);
      setRetryCount(0);
    }
  }, [result]);

  /**
   * Binds an auto-retrying mechanism for slow generation pings
   */
  const handleImageError = () => {
    if (!result || !result.imageUrl) return;

    if (retryCount < 3) {
      const nextRetry = retryCount + 1;
      console.warn(`⏳ Drawing delayed. Retrying load #${nextRetry}/3 in 4 seconds...`);
      
      setTimeout(() => {
        setRetryCount(nextRetry);
        const separator = result.imageUrl.includes("?") ? "&" : "?";
        setImgSrc(`${result.imageUrl}${separator}retry=${nextRetry}&t=${Date.now()}`);
      }, 4000);
    } else {
      setToast({
        message: "Thumbnail rendering delayed. It will populate in your library shortly.",
        type: "info",
      });
    }
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 select-none">
        Generation Preview
      </h3>

      {generating ? (
        <div className="aspect-video w-full rounded-xl border border-white/5 bg-slate-950/60 flex flex-col justify-center items-center p-4">
          <LoadingSpinner text="Optimizing layout & generating canvas..." />
        </div>
      ) : result ? (
        <div className="space-y-4">
          {/* Main graphic container */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/5 bg-slate-950">
            <img
              src={resolveThumbnailUrl(imgSrc)}
              alt="Generated Result"
              onError={handleImageError}
              className="h-full w-full object-cover"
            />
            
            {retryCount > 0 && retryCount < 3 && (
              <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center p-4 text-center select-none">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-brand-pink mb-2" />
                <p className="text-2xs text-slate-300">Retrying image load (drawing slowly) #{retryCount}/3...</p>
              </div>
            )}
          </div>

          {/* AI prompt metadata overlay */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-pink select-none">
                Refined Prompts Output
              </span>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed max-h-[140px] overflow-y-auto pr-2 select-text">
                "{result.optimizedPrompt}"
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Empty placeholder layout */
        <div className="aspect-video w-full rounded-xl border border-dashed border-white/10 bg-slate-950/30 flex flex-col justify-center items-center p-6 text-center select-none">
          <svg className="h-10 w-10 text-slate-600 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z" />
          </svg>
          <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
            Your generated thumbnail graphics will display here after creation.
          </p>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;
