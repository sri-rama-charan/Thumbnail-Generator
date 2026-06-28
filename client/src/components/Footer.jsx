/**
 * Purpose: Reusable Footer component.
 * 
 * Renders the brand declaration, current copyright year (2026), 
 * and tech metadata labels for clean design footprint.
 */

import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-slate-950/70 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:px-6 lg:px-8 md:flex-row">
        <p>© 2026 Thumblify. AI-powered YouTube thumbnail creator.</p>
        <div className="flex gap-6">
          <span className="hover:text-slate-400 transition cursor-default">Fast Prompts</span>
          <span className="hover:text-slate-400 transition cursor-default">JWT Auth</span>
          <span className="hover:text-slate-400 transition cursor-default">Community Feed</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
