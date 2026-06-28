/**
 * Purpose: Global Navigation Bar component.
 * 
 * Flow:
 * 1. Checks session states via useAuth hook.
 * 2. NavLink highlights active page routes using Tailwind v4 styles.
 * 3. Shows credit balances and logout options for logged-in profiles.
 * 4. Displays signup/signin buttons for unauthenticated visitors.
 */

import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Highlight rules for active route links
  const getLinkClasses = ({ isActive }) =>
    `rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition ${
      isActive
        ? "bg-white/10 text-white shadow-inner"
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <header className="border-b border-white/5 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Links */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-white hover:text-brand-pink transition flex items-center gap-2 select-none"
          >
            <span className="text-xl">💥</span>
            <span>Thumblify</span>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" end className={getLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/community" className={getLinkClasses}>
              Community Feed
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/generate" className={getLinkClasses}>
                  Studio
                </NavLink>
                <NavLink to="/my-generations" className={getLinkClasses}>
                  My Generations
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* User Session Interface */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {/* Credit Balance Badge */}
              <span className="text-xs bg-brand-purple/10 border border-brand-purple/20 text-brand-purple rounded-full px-3 py-1.5 font-bold tracking-wide select-none">
                💳 {user?.credits} Credits
              </span>
              {/* Display Username */}
              <span className="hidden sm:inline text-xs font-medium text-slate-300">
                {user?.name}
              </span>
              {/* Log Out button */}
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-xs font-bold text-slate-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-gradient-to-r from-brand-pink to-brand-purple px-5 py-2 text-xs font-bold text-white shadow-md shadow-brand-pink/20 hover:opacity-95 transition cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
