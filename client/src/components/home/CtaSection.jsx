/**
 * Purpose: Call-To-Action (CTA) Section component for Landing Page.
 * 
 * Renders the final sign-up encouragement panel before the footer.
 */

import React from "react";

const CtaSection = ({ onCtaClick }) => {
  return (
    <section className="relative mx-auto max-w-5xl px-4 text-center">
      {/* Background glow decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 -z-10 h-[250px] w-[400px] rounded-full bg-brand-purple/10 blur-[80px]" />
      
      <div className="rounded-3xl border border-white/5 bg-slate-900/30 px-8 py-16 shadow-2xl backdrop-blur-md sm:px-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-4">
          Ready to Explode Your Channel Growth?
        </h2>
        <p className="mx-auto max-w-xl text-slate-400 text-sm mb-8 leading-relaxed">
          Create an account in 10 seconds, get 15 free credits, and build your first high-click graphic. No credit card required.
        </p>
        <button
          onClick={onCtaClick}
          className="rounded-full bg-gradient-to-r from-brand-pink to-brand-purple px-8 py-4 font-bold text-white hover:opacity-95 transition shadow-xl shadow-brand-pink/20 cursor-pointer"
        >
          Create Your Account Now
        </button>
      </div>
    </section>
  );
};

export default CtaSection;
