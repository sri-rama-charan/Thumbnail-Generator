/**
 * Purpose: AI Thumbnail Generation Studio Page.
 * 
 * Flow:
 * 1. Manages state definitions and submission logic for both Generate and Recreate flows.
 * 2. Renders the tab switchers.
 * 3. Incorporates modular child views:
 *    - GenerateForm: Inputs for fresh thumbnail concepts.
 *    - RecreateForm: Inputs for editing reference graphics.
 *    - PreviewPanel: Displays loader states, retry error traps, and optimized prompt values.
 */

import React, { useState } from "react";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { palettes, styles } from "../utils/constants";
import GenerateForm from "../components/generate/GenerateForm";
import RecreateForm from "../components/generate/RecreateForm";
import PreviewPanel from "../components/generate/PreviewPanel";

const Generate = ({ setToast }) => {
  const { user, updateCredits } = useAuth();
  
  const [activeTab, setActiveTab] = useState("generate");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  // Form State definitions
  const [generateForm, setGenerateForm] = useState({
    title: "",
    aspectRatio: "16:9",
    style: styles[0].name,
    colors: palettes[0],
    extraPrompt: "",
    visibility: "public",
  });

  const [recreateForm, setRecreateForm] = useState({
    title: "",
    aspectRatio: "16:9",
    style: styles[0].name,
    colors: palettes[0],
    sourceImage: "",
    changeRequest: "",
    visibility: "public",
  });

  /**
   * Syncs input controls in Generate mode
   */
  const handleGenerateChange = (e) => {
    const { name, value } = e.target;
    setGenerateForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Syncs input controls in Recreate mode
   */
  const handleRecreateChange = (e) => {
    const { name, value } = e.target;
    setRecreateForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Submits request data to AI Generation endpoints
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (user && user.credits <= 0) {
      setToast({
        message: "You have run out of credits. Please contact admin to refill.",
        type: "error",
      });
      return;
    }

    const isRecreate = activeTab === "recreate";
    const payload = isRecreate ? { ...recreateForm, mode: "recreate" } : generateForm;

    // Form inputs validation checks
    if (!payload.title.trim()) {
      setToast({ message: "Topic title is required.", type: "error" });
      return;
    }

    if (isRecreate) {
      if (!payload.sourceImage.trim() || !payload.changeRequest.trim()) {
        setToast({ message: "Reference URL and Change Request are required.", type: "error" });
        return;
      }
      try {
        const parsed = new URL(payload.sourceImage);
        const host = parsed.hostname.replace("www.", "");
        if (host !== "pollinations.ai" && host !== "image.pollinations.ai") {
          setToast({
            message: "Reference images must be hosted on pollinations.ai.",
            type: "error",
          });
          return;
        }
      } catch (err) {
        setToast({ message: "Invalid reference image URL.", type: "error" });
        return;
      }
    }

    setGenerating(true);
    setResult(null);

    try {
      const data = await api.ai.generateThumbnail(payload);
      if (data.success && data.thumbnail) {
        setResult(data.thumbnail);
        updateCredits(data.credits);
        setToast({ message: "Thumbnail generated successfully!", type: "success" });
      }
    } catch (err) {
      setToast({
        message: err.message || "AI Thumbnail Generation failed.",
        type: "error",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Visual background decoration */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="h-[500px] w-[800px] rounded-full bg-brand-purple/5 blur-[120px]" />
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Thumbnail Creator Studio
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Configure visual presets to generate click-optimized layouts.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        
        {/* Left Side: Forms input panel */}
        <div className="lg:col-span-7 rounded-2xl border border-white/5 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl">
          {/* Tab switches */}
          <div className="flex border-b border-white/5 pb-4 mb-6">
            <button
              onClick={() => {
                setActiveTab("generate");
                setResult(null);
              }}
              className={`flex-1 pb-3 text-sm font-semibold tracking-wider transition border-b-2 cursor-pointer ${
                activeTab === "generate"
                  ? "border-brand-pink text-white"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              Generate Fresh Concept
            </button>
            <button
              onClick={() => {
                setActiveTab("recreate");
                setResult(null);
              }}
              className={`flex-1 pb-3 text-sm font-semibold tracking-wider transition border-b-2 cursor-pointer ${
                activeTab === "recreate"
                  ? "border-brand-pink text-white"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              Recreate/Edit Layout
            </button>
          </div>

          {/* Form wrapper */}
          <form onSubmit={handleFormSubmit}>
            {activeTab === "generate" ? (
              <GenerateForm
                form={generateForm}
                onChange={handleGenerateChange}
                onPaletteClick={(palette) => setGenerateForm((p) => ({ ...p, colors: palette }))}
                submitting={generating}
              />
            ) : (
              <RecreateForm
                form={recreateForm}
                onChange={handleRecreateChange}
                onPaletteClick={(palette) => setRecreateForm((p) => ({ ...p, colors: palette }))}
                submitting={generating}
              />
            )}
          </form>
        </div>

        {/* Right Side: Image preview panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <PreviewPanel result={result} generating={generating} setToast={setToast} />
        </div>

      </div>
    </div>
  );
};

export default Generate;
