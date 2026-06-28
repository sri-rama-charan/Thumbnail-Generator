/**
 * Purpose: Testimonials Grid Section component for Landing Page.
 * 
 * Renders quotes from creators who have used the platform.
 */

import React from "react";

const testimonialsData = [
  {
    quote: "Thumblify transformed our process. We sketch a title, select a theme, and get high-quality outputs instantly.",
    name: "Marcus K.",
    role: "Tech Explainer Creator",
    subscribers: "420K Subscribers",
  },
  {
    quote: "The recreate feature is incredibly helpful. I can modify details on successful layouts without having to rewrite prompts.",
    name: "Sarah L.",
    role: "Gaming & Shorts Creator",
    subscribers: "1.2M Subscribers",
  },
  {
    quote: "Prompt tuning with Groq is outstanding. I get high-click layouts that would normally take hours to model.",
    name: "David H.",
    role: "Finance Vlogger",
    subscribers: "150K Subscribers",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="border-y border-white/5 bg-slate-950/40 py-20 px-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Backed by Top Creators
          </h2>
          <p className="mt-4 text-slate-400">
            See how digital producers leverage Thumblify to increase click-through rates.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonialsData.map((test, index) => (
            <div
              key={index}
              className="relative rounded-2xl border border-white/5 bg-slate-900/30 p-8 shadow-xl backdrop-blur-md"
            >
              {/* Quotation mark decoration */}
              <div className="absolute top-6 right-8 text-5xl text-white/5 select-none font-serif">“</div>
              <p className="text-slate-300 italic mb-6 leading-relaxed text-sm">
                "{test.quote}"
              </p>
              <div className="mt-6 border-t border-white/5 pt-4">
                <h4 className="font-semibold text-white text-sm">{test.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-brand-pink">{test.role}</span>
                  <span className="text-xs text-slate-500">{test.subscribers}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
