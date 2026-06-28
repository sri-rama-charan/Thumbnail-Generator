/**
 * Purpose: Layout structure for Thumblify application.
 * 
 * Flow:
 * 1. Imports global header Navbar and footer components.
 * 2. Wraps page layouts in a min-height dark mode container.
 * 3. Mounts the router <Outlet> to render active child pages.
 */

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* Global header navigation bar */}
      <Navbar />

      {/* Primary child viewport router contents */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global layout footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
