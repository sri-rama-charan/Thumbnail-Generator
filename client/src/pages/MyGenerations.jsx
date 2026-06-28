/**
 * Purpose: Private Generations Library page.
 * 
 * Flow:
 * 1. Queries the user's private library list from GET /api/thumbnails.
 * 2. Renders generated designs inside a responsive grids.
 * 3. Binds card deletion handles (DELETE /api/thumbnails/:id),
 *    splicing state lists to instantly reflect removals in the UI.
 * 4. Displays clear empty-state guidelines if no files are found.
 */

import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ThumbnailCard from "../components/ThumbnailCard";

const MyGenerations = ({ setToast }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch private library history on component mount
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const data = await api.thumbnails.getUserLibrary();
        if (data.success && data.thumbnails) {
          setItems(data.thumbnails);
        }
      } catch (err) {
        setToast({
          message: err.message || "Failed to load private library history.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [setToast]);

  /**
   * Handles deleting a thumbnail from the private library history.
   * 
   * @param {string} id - Database ID of thumbnail
   */
  const handleDeleteItem = async (id) => {
    try {
      const data = await api.thumbnails.delete(id);
      if (data.success) {
        // Filter out deleted record to update UI list instantly
        setItems((prevItems) => prevItems.filter((item) => item._id !== id));
        
        setToast({
          message: "Thumbnail permanently deleted.",
          type: "success",
        });
      }
    } catch (err) {
      setToast({
        message: err.message || "Failed to delete thumbnail concept.",
        type: "error",
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Background glow decoration */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="h-[400px] w-[600px] rounded-full bg-brand-pink/5 blur-[100px]" />
      </div>

      <div className="mb-10 flex flex-col justify-between gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            My Generations
          </h1>
          <p className="mt-1.5 text-xs text-slate-400">
            A repository of your personal thumbnail ideas and generations history.
          </p>
        </div>
        <span className="text-xs bg-slate-900/50 border border-white/10 px-3 py-1.5 rounded-xl text-slate-400 font-bold select-none cursor-default self-start">
          Total Items: {items.length}
        </span>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving personal library designs..." />
      ) : items.length > 0 ? (
        // Grid lists items
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {items.map((item) => (
            <ThumbnailCard
              key={item._id}
              item={item}
              showDelete={true}
              showLike={false} // Liking not required inside private history list
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      ) : (
        // Empty state indicator
        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/10 p-16 text-center max-w-md mx-auto select-none">
          <svg className="h-12 w-12 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
          <h3 className="font-bold text-white mb-1.5 text-sm">Library is empty</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            You haven't generated any thumbnail graphic concepts yet.
          </p>
          <a
            href="/generate"
            className="inline-flex rounded-xl bg-brand-pink/15 border border-brand-pink/30 px-5 py-2.5 text-xs font-bold text-brand-pink hover:bg-brand-pink/20 transition"
          >
            Create Your First Graphic
          </a>
        </div>
      )}
    </div>
  );
};

export default MyGenerations;
