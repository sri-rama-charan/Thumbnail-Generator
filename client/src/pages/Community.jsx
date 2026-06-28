/**
 * Purpose: Public Community Feed page.
 * 
 * Flow:
 * 1. Queries feed list and suggestions from community APIs.
 * 2. Displays trending prompt suggestion bar (copied to clipboard on copy triggers).
 * 3. Renders public grids populated with ThumbnailCards.
 * 4. Integrates server toggles for liking community cards.
 */

import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ThumbnailCard from "../components/ThumbnailCard";
import TrendingIdeas from "../components/community/TrendingIdeas";

const Community = ({ setToast }) => {
  const [items, setItems] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch feed list on mount
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await api.thumbnails.getCommunityFeed();
        if (data.success) {
          setItems(data.thumbnails || []);
          setIdeas(data.ideas || []);
        }
      } catch (err) {
        setToast({
          message: err.message || "Failed to load community feed.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [setToast]);

  /**
   * Toggles liked status for community items in database and state
   */
  const handleLikeItem = async (id) => {
    try {
      const data = await api.thumbnails.like(id);
      if (data.success) {
        setItems((prevItems) =>
          prevItems.map((item) => {
            if (item._id === id) {
              const mockUserId = "temp-active-user-session";
              let updatedLikedBy = [...(item.likedBy || [])];

              if (data.liked) {
                updatedLikedBy.push(mockUserId);
              } else {
                updatedLikedBy = updatedLikedBy.filter((uid) => uid !== mockUserId);
              }

              return {
                ...item,
                likes: data.likes,
                likedBy: updatedLikedBy,
              };
            }
            return item;
          })
        );

        setToast({
          message: data.liked ? "Liked thumbnail concept!" : "Removed like.",
          type: "success",
        });
      }
    } catch (err) {
      setToast({
        message: err.message || "You must be signed in to like community graphics.",
        type: "error",
      });
    }
  };

  /**
   * Clipboard utility to copy text
   */
  const handleCopyIdea = (idea) => {
    navigator.clipboard.writeText(idea);
    setToast({
      message: "Copied trending prompt suggestion to clipboard!",
      type: "success",
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="h-[500px] w-[800px] rounded-full bg-brand-purple/5 blur-[120px]" />
      </div>

      <div className="mb-12 border-b border-white/5 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Community Feed
        </h1>
        <p className="mt-1.5 text-xs text-slate-400">
          Browse public layout concepts created by digital producers.
        </p>
      </div>

      {/* Click-to-copy trending pills list */}
      <TrendingIdeas ideas={ideas} onCopy={handleCopyIdea} />

      {loading ? (
        <LoadingSpinner text="Loading public community gallery..." />
      ) : items.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {items.map((item) => (
            <ThumbnailCard
              key={item._id}
              item={item}
              showDelete={false}
              showLike={true}
              showAuthor={true}
              onLike={handleLikeItem}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/10 p-16 text-center max-w-md mx-auto">
          <svg className="h-12 w-12 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.978 11.978 0 0112.25 21c-6.627 0-12-5.373-12-12s5.373-12 12-12 12 5.373 12 12c0 2.985-1.096 5.713-2.9 7.828L15 19.128zm0 0c-.904-.904-2.155-1.463-3.535-1.463-2.78 0-5.02 2.24-5.02 5.02h10.04a5.02 5.02 0 00-5.02-5.02z" />
          </svg>
          <h3 className="font-bold text-white mb-1.5 text-sm">Feed is empty</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No public layouts have been generated yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Community;
