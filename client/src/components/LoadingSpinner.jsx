/**
 * Purpose: Loading Spinner component.
 * 
 * Renders an animated loading ring with gradient branding colors 
 * and a customizable message indicator below the ring.
 * 
 * Props:
 * - text: Message to display (defaults to 'Loading...').
 */

import React from "react";

const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      {/* Animated spinning double border ring */}
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-purple/20 border-t-brand-pink" />
      {/* Accompanying text */}
      <p className="text-sm font-medium text-slate-400 select-none animate-pulse">
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;
