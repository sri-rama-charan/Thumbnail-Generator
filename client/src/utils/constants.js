/**
 * Purpose: Frontend Constants.
 * 
 * Provides static arrays representing available aspect ratios, 
 * thumbnail style presets, and color palettes, ensuring uniformity 
 * across the Generate studio controls and UI selectors.
 */

// Video dimensions presets
export const aspectRatios = [
  { label: "YouTube Video (16:9)", value: "16:9" },
  { label: "Instagram Grid (1:1)", value: "1:1" },
  { label: "Shorts / TikTok (9:16)", value: "9:16" },
  { label: "Classic Format (4:3)", value: "4:3" },
];

// Aesthetic/Design style presets that get passed to Groq optimization template
export const styles = [
  { name: "Bold 3D Cartoon Vector", description: "Vibrant, high-contrast 3D character illustrations" },
  { name: "Cyberpunk Glow", description: "Dusk lighting, neon gradients, and tech highlights" },
  { name: "Neon Synthwave", description: "Retro-futurist aesthetic, grid lines, glowing sun" },
  { name: "Minimalist Clean Flat", description: "Sleek shapes, flat vectors, and high readability" },
  { name: "Photographic Cinematic", description: "Dramatic lighting, film grain, and realistic depth of field" },
  { name: "Anime / Manga Vibrant", description: "Cel-shaded, detailed lines, and colorful anime styling" },
  { name: "Sleek Tech Explainer", description: "Clean gradients, dark backgrounds, high-tech interface panels" },
];

// Curated color scheme templates
export const palettes = [
  "Neon Purple and Vibrant Green",
  "Electric Blue and Sunset Orange",
  "Cyberpunk Cyan and Hot Pink",
  "Minimalist White and Slate Charcoal",
  "Luxurious Black and Gold",
  "Vibrant Crimson Red and Midnight Blue",
];
