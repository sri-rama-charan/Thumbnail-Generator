/**
 * Purpose: Route Guard wrapper for protecting authenticated views.
 * 
 * Flow:
 * 1. Consumes global session states via the 'useAuth' hook.
 * 2. If session restore query is pending ('loading === true'), displays a loading placeholder.
 * 3. If user is unauthenticated, redirects them to the Authentication screen (/auth) 
 *    using React Router's <Navigate>. Saves the attempted page url location 
 *    in React Router state so the user can be redirected back after successful login.
 * 4. If user is logged-in, renders the nested child components.
 */

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Route guard component wrapper.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 1. Display loader while verifying token status on page refreshes
  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-slate-950 text-slate-300">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-purple/20 border-t-brand-pink" />
        <p className="text-sm">Verifying session, please wait...</p>
      </div>
    );
  }

  // 2. Redirect to authentication page if session is missing
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 3. Render authenticated children
  return children;
};

export default ProtectedRoute;
