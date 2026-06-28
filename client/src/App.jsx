/**
 * Purpose: Main React Application Route Tree.
 * 
 * Flow:
 * 1. Defines global states for visual Toast notifications (toast, setToast).
 * 2. Establishes route bindings using React Router:
 *    - Public:
 *      - '/' -> Home Landing View
 *      - '/community' -> Community Feed View
 *      - '/login' -> AuthPage (Login mode)
 *      - '/signup' -> AuthPage (Signup mode)
 *    - Protected (Guarded by ProtectedRoute):
 *      - '/generate' -> Thumbnail Creator Studio
 *      - '/my-generations' -> User Library list
 * 3. Mounts the global Toast component at the bottom of the viewport for user alert feedback.
 */

import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Generate from "./pages/Generate";
import MyGenerations from "./pages/MyGenerations";
import Community from "./pages/Community";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Toast from "./components/Toast";

function App() {
  // Global toast state for user notifications across pages
  const [toast, setToast] = useState({ message: "", type: "info" });

  /**
   * Clears active toast alert from display
   */
  const closeToast = () => {
    setToast({ message: "", type: "info" });
  };

  return (
    <>
      <Routes>
        {/* All routes share MainLayout styling shell */}
        <Route path="/" element={<MainLayout />}>
          {/* Public Landing Page */}
          <Route index element={<Home />} />

          {/* Public Authentication Views */}
          <Route path="login" element={<AuthPage mode="login" setToast={setToast} />} />
          <Route path="signup" element={<AuthPage mode="signup" setToast={setToast} />} />
          <Route path="auth" element={<AuthPage mode="login" setToast={setToast} />} />

          {/* Public Community Feed */}
          <Route path="community" element={<Community setToast={setToast} />} />

          {/* Protected Studio Page */}
          <Route
            path="generate"
            element={
              <ProtectedRoute>
                <Generate setToast={setToast} />
              </ProtectedRoute>
            }
          />

          {/* Protected Private Library */}
          <Route
            path="my-generations"
            element={
              <ProtectedRoute>
                <MyGenerations setToast={setToast} />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>

      {/* Render Toast notification when a message is present */}
      {toast.message && <Toast toast={toast} onClose={closeToast} />}
    </>
  );
}

export default App;
