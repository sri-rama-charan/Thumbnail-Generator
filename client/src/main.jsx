/**
 * Purpose: Frontend Entry Mounting Point.
 * 
 * Flow:
 * 1. Imports React mounting engines and CSS stylesheets.
 * 2. Mounts the root component tree onto the HTML DOM element with ID 'root'.
 * 3. Wraps the app in:
 *    - React.StrictMode: Highlights potential code issues in development.
 *    - BrowserRouter: Manages HTML5 history URL mappings.
 *    - AuthProvider: Hydrates global session states and credit metrics.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
