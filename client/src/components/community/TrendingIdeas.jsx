/**
 * Purpose: Trending suggestions header pills.
 * 
 * Props:
 * - ideas: Array of static/dynamic suggestion string titles.
 * - onCopy: Callback trigger when pill is clicked.
 */

import React from "react";

const TrendingIdeas = ({ ideas, onCopy }) => {
  if (!ideas || ideas.length === 0) return null;

  return (
    <div className="mb-10 select-none">
      <span className="block text-2xs font-extrabold uppercase tracking-wider text-brand-pink mb-3">
        Trending Idea Prompts (Click to Copy)
      </span>
      <div className="flex flex-wrap gap-2.5">
        {ideas.map((idea, index) => (
          <button
            key={index}
            onClick={() => onCopy(idea)}
            className="rounded-full bg-white/5 border border-white/10 hover:border-brand-pink/30 hover:bg-brand-pink/5 hover:text-white px-3.5 py-1.5 text-2xs font-bold text-slate-300 transition cursor-pointer"
          >
            💡 {idea}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingIdeas;
