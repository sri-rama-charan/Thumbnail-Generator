/**
 * Purpose: Form subcomponent for registering new user accounts.
 */

import React, { useState } from "react";

const SignupForm = ({ onSubmit, submitting }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, password });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Full Name
        </label>
        <div className="mt-1.5">
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="block w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-600 shadow-inner outline-none transition focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/30"
          />
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Email Address
        </label>
        <div className="mt-1.5">
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="block w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-600 shadow-inner outline-none transition focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/30"
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Password
        </label>
        <div className="mt-1.5">
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="block w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-600 shadow-inner outline-none transition focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/30"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={submitting}
          className="relative flex w-full justify-center rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-pink/20 transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand-pink/50 disabled:opacity-50"
        >
          {submitting ? (
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Creating Account...</span>
            </div>
          ) : (
            <span>Sign Up</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
