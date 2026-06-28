/**
 * Purpose: Authentication Page (Login / Signup Forms).
 * 
 * Flow:
 * 1. Coordinates routing redirection hooks.
 * 2. Conditionally renders LoginForm or SignupForm based on current page route mode parameters.
 * 3. Handles form validations and submits request data using api wrappers.
 * 4. Passes results to AuthContext saveAuth hooks on success.
 */

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";

const AuthPage = ({ mode, setToast }) => {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const location = useLocation();
  const { saveAuth } = useAuth();
  
  const [submitting, setSubmitting] = useState(false);
  const from = location.state?.from?.pathname || "/generate";

  /**
   * Dispatches login or registration API calls
   */
  const handleAuthSubmit = async (formData) => {
    const { name, email, password } = formData;

    // --- Client Side Validations ---
    if (!email || !password) {
      setToast({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    if (!isLogin && !name) {
      setToast({ message: "Please enter your name to register.", type: "error" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setToast({ message: "Please enter a valid email address.", type: "error" });
      return;
    }

    if (password.length < 6) {
      setToast({ message: "Password must be at least 6 characters long.", type: "error" });
      return;
    }

    setSubmitting(true);

    try {
      let data;
      if (isLogin) {
        data = await api.auth.login(email, password);
      } else {
        data = await api.auth.signup(name, email, password);
      }

      if (data.success && data.token && data.user) {
        saveAuth(data.token, data.user);
        setToast({
          message: isLogin ? "Welcome back!" : "Account created successfully! Welcome to Thumblify.",
          type: "success",
        });
        navigate(from, { replace: true });
      }
    } catch (err) {
      setToast({
        message: err.message || "An authentication error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-76px)] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      {/* Background glowing styles */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="h-[400px] w-[600px] rounded-full bg-brand-purple/10 blur-[120px]" />
        <div className="absolute h-[300px] w-[500px] rounded-full bg-brand-pink/5 blur-[100px] translate-x-20 translate-y-10" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {isLogin
              ? "Access your dashboard to generate fresh concepts"
              : "Get 15 free credits instantly on registration"}
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl">
          {isLogin ? (
            <LoginForm onSubmit={handleAuthSubmit} submitting={submitting} />
          ) : (
            <SignupForm onSubmit={handleAuthSubmit} submitting={submitting} />
          )}

          {/* Mode Switch links */}
          <div className="mt-6 border-t border-white/5 pt-6 text-center">
            <p className="text-xs text-slate-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link
                to={isLogin ? "/signup" : "/login"}
                className="font-semibold text-brand-pink hover:text-brand-pink/80 transition"
              >
                {isLogin ? "Create account (Free)" : "Sign in here"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
