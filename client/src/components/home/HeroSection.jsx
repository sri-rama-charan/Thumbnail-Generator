/**
 * Purpose: Hero Section component for Landing Page.
 * 
 * Renders the headline, taglines, glowing background highlights, 
 * and primary calls to action navigating to the generator or community feed.
 */

import React from "react";

const HeroSection = ({ onStartClick, onExploreClick }) => {
  return (
    <section className="relative pt-20 md:pt-32 px-4 text-center">
      {/* Background glow decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-20 -z-10 h-[300px] w-[500px] rounded-full bg-brand-pink/10 blur-[100px]" />
      
      <div className="mx-auto max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-pink/20 bg-brand-pink/5 px-4 py-1.5 text-xs font-semibold text-brand-pink mb-6">
          🚀 Powered by Groq & Pollinations
        </div>
        <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Stop Guessing. Generate{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-purple">
            Clickable Thumbnails.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Thumblify combines Groq SDK LLM prompt optimization with Pollinations AI to translate rough text ideas into stunning YouTube thumbnail graphics instantly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={onStartClick}
            className="w-full sm:w-auto rounded-full bg-gradient-to-r from-brand-pink to-brand-purple px-8 py-4 font-bold text-white hover:opacity-95 transition shadow-xl shadow-brand-pink/25 cursor-pointer"
          >
            Start Generating Free
          </button>
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto rounded-full bg-white/5 border border-white/10 px-8 py-4 font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            Explore Community Feed
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
