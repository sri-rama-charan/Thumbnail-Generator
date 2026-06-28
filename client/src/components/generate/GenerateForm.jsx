/**
 * Purpose: Form subcomponent for Generate Mode in Studio.
 * 
 * Renders controls: Topic, Aspect Ratio, Style selector, Palette selector pills, 
 * Supporting prompt context, and Visibility switches.
 */

import React from "react";
import { aspectRatios, palettes, styles } from "../../utils/constants";

const GenerateForm = ({ form, onChange, onPaletteClick, submitting }) => {
  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Video Topic / Idea Title
        </label>
        <input
          type="text"
          name="title"
          required
          value={form.title}
          onChange={onChange}
          placeholder="e.g. 10 Secret VS Code Extensions"
          className="mt-2 block w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-brand-pink/50"
        />
      </div>

      {/* Aspect Ratio & Style Presets Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Aspect Ratio
          </label>
          <select
            name="aspectRatio"
            value={form.aspectRatio}
            onChange={onChange}
            className="mt-2 block w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-pink/50 cursor-pointer"
          >
            {aspectRatios.map((ratio) => (
              <option key={ratio.value} value={ratio.value} className="bg-slate-950 text-white">
                {ratio.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Style Preset
          </label>
          <select
            name="style"
            value={form.style}
            onChange={onChange}
            className="mt-2 block w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-pink/50 cursor-pointer"
          >
            {styles.map((style) => (
              <option key={style.name} value={style.name} className="bg-slate-950 text-white" title={style.description}>
                {style.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Color Palette Selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Color Palette Selection
        </label>
        <div className="mt-3 grid gap-3 grid-cols-2 sm:grid-cols-3">
          {palettes.map((palette) => {
            const isSelected = form.colors === palette;
            return (
              <button
                key={palette}
                type="button"
                onClick={() => onPaletteClick(palette)}
                className={`rounded-xl border px-3 py-2.5 text-2xs font-semibold tracking-wide transition cursor-pointer text-center select-none ${
                  isSelected
                    ? "border-brand-pink bg-brand-pink/10 text-white shadow-md"
                    : "border-white/5 bg-slate-950/40 text-slate-400 hover:text-white"
                }`}
              >
                {palette}
              </button>
            );
          })}
        </div>
      </div>

      {/* Context TextArea */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Supporting Context / Prompts (Optional)
        </label>
        <textarea
          name="extraPrompt"
          rows="3"
          value={form.extraPrompt}
          onChange={onChange}
          placeholder="e.g. Include a person looking shocked at the screen with neon graphics in the background."
          className="mt-2 block w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-brand-pink/50 resize-none"
        />
      </div>

      {/* Visibility Switches */}
      <div className="flex items-center gap-6 border-t border-white/5 pt-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Feed Visibility:
        </span>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={form.visibility === "public"}
              onChange={onChange}
              className="accent-brand-pink"
            />
            <span>Public Community Feed</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={form.visibility === "private"}
              onChange={onChange}
              className="accent-brand-pink"
            />
            <span>Private Library Only</span>
          </label>
        </div>
      </div>

      {/* Action button */}
      <div className="border-t border-white/5 pt-5">
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex justify-center rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple px-4 py-3.5 text-sm font-bold tracking-wide text-white hover:opacity-95 transition shadow-lg disabled:opacity-50 cursor-pointer"
        >
          {submitting ? (
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Optimizing & Generating (Takes ~10s)...</span>
            </div>
          ) : (
            <span>🚀 Consume 1 Credit & Generate</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default GenerateForm;
