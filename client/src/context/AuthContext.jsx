/**
 * Purpose: Authentication Context Provider.
 * 
 * Flow:
 * 1. Creates a React Context 'AuthContext' to hold current user auth state and credits globally.
 * 2. On component mount, reads the localStorage for 'thumblify_token'.
 * 3. If present, calls GET /api/auth/me to verify token validity and restore profile details (credits, username).
 * 4. Provides utility actions:
 *    - saveAuth: Saves token to localStorage and user structure to state (triggers on signup/login).
 *    - logout: Clears credentials and redirects.
 *    - updateCredits: Mutates the user's credits state directly when a thumbnail is successfully generated.
 * 5. Exports a custom hook 'useAuth' for components to access authentication data.
 */

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api";

// Create context object with default empty values
const AuthContext = createContext(null);

/**
 * Global Authentication Context Provider Component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Checks token and restores session on page load or browser refreshes
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("thumblify_token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log("🔑 Restoring session from storage token...");
        const data = await api.auth.getMe();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          // If response succeeded but user profile was empty, purge session
          logout();
        }
      } catch (error) {
        console.warn("⚠️ Authentication session expired or is invalid. Logging out.");
        // Clear invalid token
        logout();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  /**
   * Persists authentication details after successful registration/login.
   * 
   * @param {string} token - The signed JWT token from server
   * @param {Object} userData - User metadata (id, name, email, credits)
   */
  const saveAuth = (token, userData) => {
    localStorage.setItem("thumblify_token", token);
    setUser(userData);
  };

  /**
   * Destroys active user session.
   * Clears state and localStorage.
   */
  const logout = () => {
    localStorage.removeItem("thumblify_token");
    setUser(null);
  };

  /**
   * Direct method to adjust user's credit balances without requesting a full profile reload.
   * 
   * @param {number} newCredits - The new remaining credits count
   */
  const updateCredits = (newCredits) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        credits: newCredits,
      };
    });
  };

  // Check state helper
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        saveAuth,
        logout,
        updateCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom Hook: useAuth
 * Provides access to the global authentication state object.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be consumed within an AuthProvider wrapper.");
  }
  return context;
};
