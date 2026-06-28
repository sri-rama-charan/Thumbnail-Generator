/**
 * Purpose: Features Grid Section component for Landing Page.
 * 
 * Renders selectable feature cards describing prompt cache, dual modes, 
 * secure whitelists, download proxy, and details lists.
 */

import React, { useState } from "react";

const featuresData = [
  {
    id: 0,
    icon: (
      <svg className="w-8 h-8 text-brand-pink" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Groq Prompt Optimization",
    description: "Our LLM layer refines simple concepts into descriptive prompt structures optimized for image models.",
  },
  {
    id: 1,
    icon: (
      <svg className="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Dual-Mode Generation",
    description: "Generate entirely fresh visual graphics or edit reference layouts directly using simple change requests.",
  },
  {
    id: 2,
    icon: (
      <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
    ),
    title: "Private Library",
    description: "Access your generation history, track parameters, duplicate parameters, or delete entries directly.",
  },
  {
    id: 3,
    icon: (
      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Community Feed Showcase",
    description: "Browse public designs, toggle visibility, and like layouts to gather trending content inspiration.",
  },
  {
    id: 4,
    icon: (
      <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: "CORS-Bypassing Downloads",
    description: "Download layouts instantly with backend image proxy streaming, circumventing browser CORS hurdles.",
  },
  {
    id: 5,
    icon: (
      <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Security Whitelist Guard",
    description: "Reference images are strictly normalized and vetted to shield against injection attacks.",
  },
];

const FeaturesSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Optimized for YouTube Creators
        </h2>
        <p className="mt-4 text-slate-400">
          Engineered to refine design concepts, persistence, and downloads in a unified workspace.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {featuresData.map((feat) => (
          <div
            key={feat.id}
            onMouseEnter={() => setHoveredCard(feat.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`rounded-2xl border p-8 transition-all duration-300 backdrop-blur-md cursor-default ${
              hoveredCard === feat.id
                ? "border-brand-pink/30 bg-slate-900/60 -translate-y-1 shadow-lg shadow-brand-pink/5"
                : "border-white/5 bg-slate-900/20"
            }`}
          >
            <div className="mb-5 inline-flex p-3 rounded-xl bg-white/5 border border-white/10">
              {feat.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">{feat.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
