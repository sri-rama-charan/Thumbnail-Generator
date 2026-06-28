/**
 * Purpose: Vite configuration for React and Tailwind CSS v4.
 * 
 * Imports:
 * - @tailwindcss/vite: compiles Tailwind classes directly during build.
 * - @vitejs/plugin-react: adds React fast refresh and support in Vite.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
});
