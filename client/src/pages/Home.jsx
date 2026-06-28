/**
 * Purpose: Public Landing / Home view.
 * 
 * Flow:
 * 1. Renders modular landing page sections (HeroSection, FeaturesSection, 
 *    TestimonialsSection, PricingSection, CtaSection).
 * 2. Implements navigation callbacks for user redirection to generator or signup routes.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import PricingSection from "../components/home/PricingSection";
import CtaSection from "../components/home/CtaSection";

export default function Home() {
  const navigate = useNavigate();

  const handleStart = () => navigate("/generate");
  const handleExplore = () => navigate("/community");
  const handleSignup = () => navigate("/signup");

  return (
    <div className="flex flex-col gap-24 overflow-hidden pb-16">
      {/* 1. Hero Section */}
      <HeroSection onStartClick={handleStart} onExploreClick={handleExplore} />

      {/* 2. Features Grid */}
      <FeaturesSection />

      {/* 3. Client Testimonials */}
      <TestimonialsSection />

      {/* 4. Billing Pricing Plans */}
      <PricingSection onSelectPlan={handleSignup} />

      {/* 5. Final CTA Invitation */}
      <CtaSection onCtaClick={handleSignup} />
    </div>
  );
}
