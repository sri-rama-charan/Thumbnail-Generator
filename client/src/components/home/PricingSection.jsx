/**
 * Purpose: Pricing Section component for Landing Page.
 * 
 * Flow:
 * 1. Tracks billing interval state (Monthly vs Yearly billing options).
 * 2. Formulates pricing details for each plan based on the interval.
 * 3. Renders plan feature checklists and CTA trigger links.
 */

import React, { useState } from "react";

const PricingSection = ({ onSelectPlan }) => {
  const [billingInterval, setBillingInterval] = useState("monthly");

  const plans = [
    {
      name: "Free Trial",
      priceMonthly: 0,
      priceYearly: 0,
      description: "Ideal for checking layout styles and prompting rules.",
      features: [
        "15 generation credits on startup",
        "Access to Generate & Recreate modes",
        "Public community showcase",
        "Standard image warmups",
      ],
      buttonText: "Get Started Free",
      action: onSelectPlan,
      highlighted: false,
    },
    {
      name: "Pro Studio",
      priceMonthly: 12,
      priceYearly: 9,
      description: "For active creators requiring bulk graphics generation.",
      features: [
        "250 credits refilled monthly",
        "Prioritized prompt cache matching",
        "Private generation settings",
        "Enhanced Groq prompt expansion",
        "Fast proxy download triggers",
      ],
      buttonText: "Upgrade to Pro",
      action: onSelectPlan,
      highlighted: true,
    },
    {
      name: "Creator Elite",
      priceMonthly: 29,
      priceYearly: 22,
      description: "For production teams and multi-channel agencies.",
      features: [
        "Unlimited generation credits",
        "Dedicated prompt templates",
        "Early access to upcoming Flux-Pro models",
        "Priority image-warming channels",
        "Advanced reference matching",
      ],
      buttonText: "Contact Sales",
      action: onSelectPlan,
      highlighted: false,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Flexible Plans for Any Goal
        </h2>
        <p className="mt-4 text-slate-400">
          Sign up to get starting credits, or upgrade for bulk rendering capacity.
        </p>

        {/* Monthly / Yearly Switch Toggle */}
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/50 p-1.5">
          <button
            onClick={() => setBillingInterval("monthly")}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
              billingInterval === "monthly"
                ? "bg-brand-pink text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingInterval("yearly")}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
              billingInterval === "yearly"
                ? "bg-brand-pink text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Annual Billing (Save 25%)
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto items-stretch">
        {plans.map((plan, idx) => {
          const displayPrice = billingInterval === "monthly" ? plan.priceMonthly : plan.priceYearly;

          return (
            <div
              key={idx}
              className={`relative flex flex-col justify-between rounded-3xl p-8 transition border-2 ${
                plan.highlighted
                  ? "border-brand-pink bg-slate-900/60 shadow-2xl shadow-brand-pink/5"
                  : "border-white/5 bg-slate-900/20"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-brand-pink px-3 py-1 text-2xs font-extrabold uppercase tracking-wider text-white">
                  Most Popular
                  </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-400 mb-6">{plan.description}</p>

                <div className="flex items-baseline text-white mb-6">
                  <span className="text-4xl font-extrabold">$</span>
                  <span className="text-5xl font-extrabold tracking-tight">{displayPrice}</span>
                  <span className="text-sm font-semibold text-slate-400 ml-2">/mo</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs text-slate-300">
                      <svg className="h-4 w-4 shrink-0 text-brand-pink" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={plan.action}
                className={`w-full rounded-xl py-3 text-xs font-bold transition cursor-pointer ${
                  plan.highlighted
                    ? "bg-brand-pink text-white hover:bg-brand-pink/90"
                    : "bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PricingSection;
