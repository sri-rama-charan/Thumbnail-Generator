Project Introduction
Thumblify is a full-stack MERN application built for creators who need fast, visually strong thumbnail concepts. The project combines a React frontend, an Express/MongoDB backend, JWT authentication, a credit system, Groq-based prompt refinement, and Pollinations image generation.

The app has two core creation modes:

Generate Thumbnail — starts from a topic, style, aspect ratio, palette, optional prompt, and optional image URL.
Recreate Thumbnail — starts from an existing thumbnail concept or reference image, then applies a specific change request.
On the backend, Groq is used as a text prompt optimizer, not as the final image generator. The optimized prompt is then converted into a Pollinations image URL. The resulting thumbnail is stored in MongoDB together with prompt metadata, aspect ratio, mode, and ownership details.

On the frontend, users can:

sign up and log in
generate thumbnails in a protected studio
browse their own saved generations
explore a public community feed
like community thumbnails
download generated images
Application Flow
1234567891011
User signs up or logs in        ↓JWT token is stored in localStorage        ↓Protected studio page becomes accessible        ↓User chooses one of two modes:Option A: Generate Thumbnail    → Enter title/topic    → Choose aspect ratio, style, and color palette 
Expand
Main Functionalities
JWT Authentication
The application supports signup, login, and profile restoration using JWT. Protected pages such as the studio and personal library are only available when the token is valid.

Prompt Optimization with Groq
Instead of sending raw user input directly to the image generator, the backend uses Groq to rewrite the request into a compact, more visually effective thumbnail prompt.

Generate Mode
Users can generate a fresh thumbnail by combining:

title/topic
style preset
aspect ratio
palette selection
optional supporting prompt
optional source image URL
Recreate Mode
Users can refine an existing thumbnail idea by supplying:

a current thumbnail topic
an image URL
a change request
style, aspect ratio, and palette
The backend safely normalizes the source image URL and only enables direct image-reference generation for supported hosts.

Credit-Based Usage
Each authenticated user starts with 15 credits. On every successful generation, one credit is deducted from the user record.

Persistent Thumbnail Storage
Every successful generation creates a Thumbnail document with prompt, image URL, mode, ownership, and display metadata.

My Generations
Users can fetch their personal thumbnail history from MongoDB and delete entries directly from the UI.

Community Feed
Public thumbnails are exposed through a shared feed with creator names, likes, and a small set of trending idea prompts.

Download Support
Every thumbnail card supports client-side download by fetching the image, converting it to a Blob, and triggering a browser download.

Preview Retry for Recreate Flow
Because recreate images can become available slightly later than standard generations, the preview component retries failed image loads up to three times with cache-busting query parameters.

Advantages
Focused creator workflow — The app is not a generic image generator; it is centered specifically on YouTube-style thumbnail creation.
Compact AI prompting layer — Groq is used to improve prompt quality without requiring the user to manually write dense image prompts.
Two-mode creation model — Both fresh generation and recreate/edit-style workflows are supported from one studio page.
Authentication plus credits — The application is structured as a real product workflow, not just an open demo UI.
Persistent asset history — Generated thumbnails remain available through MongoDB-backed personal and community views.
Community inspiration loop — Public feed and trending ideas give users fast idea discovery.
Free-service alignment — The implementation uses Groq and Pollinations, both chosen to support low-cost or free-tier experimentation.
Clean separation of concerns — Auth, AI generation, thumbnail CRUD, prompt utilities, and frontend presentation are separated into clear modules.
Prerequisites
Software to Install
Node.js v18 or later
npm
MongoDB Atlas account
Groq API key
VS Code (recommended)
Accounts to Create
Service	Where	What For
MongoDB Atlas	cloud.mongodb.com	Persistent storage for users and thumbnails
Groq	console.groq.com/keys	Prompt optimization API key
Prior Knowledge Expected
Basic React and component state
JavaScript async/await
REST API fundamentals
MongoDB and Mongoose basics
Authentication concepts with JWT
Tech Stack
Backend (Server)
Technology	Purpose
Node.js	JavaScript runtime for the server
Express.js	REST API framework
MongoDB + Mongoose	Database and ODM for users and thumbnails
Groq SDK	Prompt optimization for image generation
jsonwebtoken	JWT creation and verification
bcryptjs	Password hashing and comparison
dotenv	Environment variable loading
cors	Frontend/backend cross-origin support
morgan	HTTP request logging
Frontend (Client)
Technology	Purpose
React 18	Component-based UI
Vite	Development server and build tool
React Router v6	Client-side routing
Tailwind CSS	Utility-first styling
Context API	Auth state management
Environment Variables
The server-side environment variables are defined through the final implementation’s example file:

123456
MONGO_URI=mongodb+srv://dbUser:<db_password>@cluster0.fweuxm9.mongodb.net/?appName=Cluster0JWT_SECRET=replace_with_a_strong_secretGROQ_API_KEY=replace_with_your_groq_api_keyGROQ_MODEL=llama-3.3-70b-versatileCLIENT_URL=http://localhost:5173PORT=5000
The client uses:

1
VITE_API_URL=http://localhost:5000/api
What These Variables Control
MONGO_URI — MongoDB Atlas connection string
JWT_SECRET — signing secret for auth tokens
GROQ_API_KEY — API key for prompt optimization
GROQ_MODEL — model ID for Groq prompt generation
CLIENT_URL — allowed frontend origin for CORS
PORT — backend port
VITE_API_URL — frontend base URL for API requests
API Endpoints Overview
Method	Endpoint	Description
POST	/api/auth/signup	Register a new user and return JWT + initial credits
POST	/api/auth/login	Authenticate an existing user and return JWT
GET	/api/auth/me	Validate token and return current user profile
POST	/api/ai/generate-thumbnail	Generate or recreate a thumbnail for the authenticated user
GET	/api/thumbnails	Get the current user’s saved thumbnails
DELETE	/api/thumbnails/:id	Delete one saved thumbnail belonging to the current user
GET	/api/thumbnails/community	Fetch public thumbnails plus trending ideas
POST	/api/thumbnails/community/:id/like	Increment a public thumbnail’s like count
GET	/api/thumbnails/proxy	Proxy allowed remote image URLs through the backend
GET	/api/health	Health check route
Backend Implementation — Step by Step
Backend Step 1 — Express Entry Point
File: server/server.js

What we’re implementing: The final Express server setup with environment loading, MongoDB connection, CORS, route mounting, and centralized error handling.

JAVASCRIPT
1234567891011
const express = require("express");const cors = require("cors");const morgan = require("morgan");const dotenv = require("dotenv");const connectDB = require("./config/db");dotenv.config();const authRoutes = require("./routes/authRoutes");const aiRoutes = require("./routes/aiRoutes");const thumbnailRoutes = require("./routes/thumbnailRoutes"); 
Expand
Key implementation points:

dotenv.config() loads .env before anything else consumes environment variables.
connectDB() is executed once during startup so all route handlers run only after Mongoose attempts to connect.
CORS is locked to CLIENT_URL and credentials are enabled for a smoother local frontend/backend workflow.
The backend binds to 127.0.0.1 by default through HOST, which matches the current local development behavior.
Auth, AI, and thumbnail routes are mounted under separate namespaces for clean separation of responsibilities.
Backend Step 2 — Database Connection
File: server/config/db.js

JAVASCRIPT
1234567891011
const mongoose = require("mongoose");const connectDB = async () => {  try {    await mongoose.connect(process.env.MONGO_URI);    console.log("MongoDB connected");  } catch (error) {    console.error("MongoDB connection failed:", error.message);    process.exit(1);  }}; 
Expand
Why this matters:

The app depends on MongoDB for both User and Thumbnail documents.
process.exit(1) ensures the server does not continue in a half-working state when persistence is unavailable.
Backend Step 3 — User Model
File: server/models/User.js

JAVASCRIPT
1234567891011
const mongoose = require("mongoose");const userSchema = new mongoose.Schema(  {    name: {      type: String,      required: true,      trim: true    },    email: {      type: String, 
Expand
Key model decisions:

Email addresses are normalized to lowercase.
Credits are stored directly on the user and start at 15.
Passwords are stored hashed, never in plaintext.
Backend Step 4 — Thumbnail Model
File: server/models/Thumbnail.js

JAVASCRIPT
1234567891011
const mongoose = require("mongoose");const thumbnailSchema = new mongoose.Schema(  {    userId: {      type: mongoose.Schema.Types.ObjectId,      ref: "User",      required: true    },    title: {      type: String, 
Expand
Why this model works for the app:

It stores both the optimized prompt and the original user-provided prompt/change request context.
mode distinguishes between fresh generation and recreate flows.
visibility and likes support the public community feed without needing a second collection.
Backend Step 5 — JWT Token Utility
File: server/utils/token.js

JAVASCRIPT
1234567
const jwt = require("jsonwebtoken");const generateToken = (id) => {  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });};module.exports = generateToken;
This helper keeps token creation centralized so both signup and login return the same JWT format.

Backend Step 6 — Authentication Middleware
File: server/middleware/authMiddleware.js

JAVASCRIPT
1234567891011
const jwt = require("jsonwebtoken");const User = require("../models/User");const authMiddleware = async (req, res, next) => {  try {    const authHeader = req.headers.authorization;    if (!authHeader || !authHeader.startsWith("Bearer ")) {      return res.status(401).json({ success: false, message: "Unauthorized" });    } 
Expand
Key implementation points:

The middleware extracts the bearer token from Authorization.
JWT verification and user lookup happen before protected handlers run.
The password field is removed from the attached req.user document.
Backend Step 7 — Auth Controller
File: server/controllers/authController.js

JAVASCRIPT
1234567891011
const bcrypt = require("bcryptjs");const User = require("../models/User");const generateToken = require("../utils/token");const signup = async (req, res, next) => {  try {    const { name, email, password } = req.body;    if (!name || !email || !password) {      return res.status(400).json({ success: false, message: "All fields are required" });    } 
Expand
What this controller gives the frontend:

account creation
credential validation
JWT issuance
current-user restoration on refresh
Backend Step 8 — Prompt Cache
File: server/utils/promptCache.js

JAVASCRIPT
1234567891011
const promptCache = new Map();const buildCacheKey = (payload) => {  return JSON.stringify({    version: 2,    title: payload.title,    style: payload.style,    colors: payload.colors,    aspectRatio: payload.aspectRatio,    extraPrompt: payload.extraPrompt,    sourceImage: payload.sourceImage, 
Expand
This in-memory cache prevents repeated prompt-optimization calls for identical inputs during a single server lifetime.

Backend Step 9 — Thumbnail Helper Layer
File: server/utils/thumbnailHelpers.js

What this file handles:

Groq client initialization
prompt cleaning and compaction
prompt template creation
source image normalization
supported-host validation for recreate mode
Pollinations URL creation
image warm-up before the response is returned
JAVASCRIPT
123456789101112
const Groq = require("groq-sdk");const { getCachedPrompt, setCachedPrompt } = require("./promptCache");const SUPPORTED_REFERENCE_IMAGE_HOSTS = new Set([  "image.pollinations.ai",  "pollinations.ai"]);const groqClient = process.env.GROQ_API_KEY  ? new Groq({ apiKey: process.env.GROQ_API_KEY })  : null;  
Expand
Backend Step 10 — AI Controller
File: server/controllers/aiController.js

JAVASCRIPT
1234567891011
const Thumbnail = require("../models/Thumbnail");const User = require("../models/User");const {  optimizePrompt,  buildImageUrl,  normalizeSourceImageUrl,  canUseSourceImageForGeneration,  warmImageUrl} = require("../utils/thumbnailHelpers");const generateThumbnail = async (req, res, next) => { 
Expand
What this controller does in one request:

validates input
checks user credits
normalizes and filters the source image URL
optimizes the prompt with Groq
builds the Pollinations URL
warms the image
saves the thumbnail
decrements credits
Backend Step 11 — Thumbnail Controller
File: server/controllers/thumbnailController.js

JAVASCRIPT
1234567891011
const Thumbnail = require("../models/Thumbnail");const ALLOWED_IMAGE_HOSTS = new Set(["image.pollinations.ai", "pollinations.ai"]);const getUserThumbnails = async (req, res, next) => {  try {    const thumbnails = await Thumbnail.find({ userId: req.user._id }).sort({ createdAt: -1 });    return res.json({ success: true, thumbnails });  } catch (error) {    next(error);  } 
Expand
Backend Step 12 — Route Definitions
Files: server/routes/authRoutes.js, server/routes/aiRoutes.js, server/routes/thumbnailRoutes.js

JAVASCRIPT
1234567891011
const express = require("express");const { signup, login, getProfile } = require("../controllers/authController");const authMiddleware = require("../middleware/authMiddleware");const router = express.Router();router.post("/signup", signup);router.post("/login", login);router.get("/me", authMiddleware, getProfile);module.exports = router; 
Expand
JAVASCRIPT
123456789
const express = require("express");const { generateThumbnail } = require("../controllers/aiController");const authMiddleware = require("../middleware/authMiddleware");const router = express.Router();router.post("/generate-thumbnail", authMiddleware, generateThumbnail);module.exports = router;
JAVASCRIPT
1234567891011
const express = require("express");const authMiddleware = require("../middleware/authMiddleware");const {  getUserThumbnails,  deleteThumbnail,  getCommunityFeed,  proxyThumbnailImage,  likeThumbnail} = require("../controllers/thumbnailController");const router = express.Router(); 
Expand
These route files keep the HTTP layer small and push actual logic into controllers.

Frontend Implementation — Step-by-Step
Frontend Step 1 — React Entry Point
File: client/src/main.jsx

JSX
1234567891011
import React from "react";import ReactDOM from "react-dom/client";import { BrowserRouter } from "react-router-dom";import App from "./App";import "./index.css";import { AuthProvider } from "./context/AuthContext";ReactDOM.createRoot(document.getElementById("root")).render(  <React.StrictMode>    <BrowserRouter>      <AuthProvider> 
Expand
The entire app is wrapped with both BrowserRouter and AuthProvider, making routing and auth state available everywhere.

Frontend Step 2 — Global API Layer
File: client/src/api/api.js

JAVASCRIPT
1234567891011
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";const request = async (endpoint, options = {}) => {  const token = localStorage.getItem("thumblify_token");  const response = await fetch(`${API_BASE_URL}${endpoint}`, {    headers: {      "Content-Type": "application/json",      ...(token ? { Authorization: `Bearer ${token}` } : {}),      ...(options.headers || {})    }, 
Expand
Key implementation behavior:

Automatically attaches the JWT token when available.
Throws a usable Error with the backend message for toast notifications.
Centralizes every client-side API call in one module.
Frontend Step 3 — Auth Context
File: client/src/context/AuthContext.jsx

JSX
1234567891011
import { createContext, useContext, useEffect, useState } from "react";import { api } from "../api/api";const AuthContext = createContext(null);export const AuthProvider = ({ children }) => {  const [user, setUser] = useState(null);  const [loading, setLoading] = useState(true);  useEffect(() => {    const token = localStorage.getItem("thumblify_token"); 
Expand
This context keeps auth restoration, token persistence, logout, and live credit updates in one place.

Frontend Step 4 — Route Tree
File: client/src/App.jsx

JSX
1234567891011
import { useState } from "react";import { Route, Routes } from "react-router-dom";import MainLayout from "./layouts/MainLayout";import Home from "./pages/Home";import Generate from "./pages/Generate";import MyGenerations from "./pages/MyGenerations";import Community from "./pages/Community";import AuthPage from "./pages/AuthPage";import ProtectedRoute from "./components/ProtectedRoute";import Toast from "./components/Toast"; 
Expand
Frontend Step 5 — Protected Route
File: client/src/components/ProtectedRoute.jsx

JSX
1234567891011
import { Navigate, useLocation } from "react-router-dom";import { useAuth } from "../context/AuthContext";import LoadingSpinner from "./LoadingSpinner";const ProtectedRoute = ({ children }) => {  const { isAuthenticated, loading } = useAuth();  const location = useLocation();  if (loading) {    return <LoadingSpinner text="Checking your session..." />;  } 
Expand
Protected pages are:

/generate
/my-generations
Frontend Step 6 — Thumbnail URL Resolver
File: client/src/utils/thumbnailUrls.js

JAVASCRIPT
1234567891011
import API_BASE_URL from "../api/api";const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;const POLLINATIONS_HOSTS = new Set(["image.pollinations.ai", "pollinations.ai"]);export const resolveThumbnailUrl = (imageUrl) => {  if (!imageUrl) {    return "";  }  if (!ABSOLUTE_URL_PATTERN.test(imageUrl)) { 
Expand
This utility decides when an image can be loaded directly and when it should be proxied.

Frontend Step 7 — Home (Landing) Page
File: client/src/pages/Home.jsx

This is the public landing page mapped to the / route in the route tree. It is not protected, so any visitor can view it. The page is composed of five marketing sections:

a hero with the headline and primary call-to-action buttons
a features grid
a testimonials grid
a pricing section with selectable plans
a closing call-to-action
It uses useNavigate to route visitors into the studio (/generate) and the community feed (/community), and local state to track the hovered feature card and the active pricing plan.

JSX
123456789101112
import React, { useState } from "react";import { useNavigate } from "react-router-dom";export default function Home() {  const navigate = useNavigate();  const [hoveredCard, setHoveredCard] = useState(null);  const [activePlan, setActivePlan] = useState("pro");  const features = [    {      icon: <svg className="w-10 h-10 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,  
Expand
Frontend Step 8 — Generate Page
File: client/src/pages/Generate.jsx

This is the core studio page. It handles:

generate vs recreate tabs
form state
API submission
credits update
preview rendering
preview retry behavior
JSX
123456789101112
import { useEffect, useState } from "react";import { api } from "../api/api";import { useAuth } from "../context/AuthContext";import { aspectRatios, palettes, styles } from "../utils/constants";import { resolveThumbnailUrl } from "../utils/thumbnailUrls";const defaultGenerateState = {  title: "",  aspectRatio: "16:9",  style: "Bold",  colors: palettes[0],  
Expand
Frontend Step 9 — Personal Library and Community Feed
Files: client/src/pages/MyGenerations.jsx, client/src/pages/Community.jsx

JSX
1234567891011
import { useEffect, useState } from "react";import { api } from "../api/api";import LoadingSpinner from "../components/LoadingSpinner";import ThumbnailCard from "../components/ThumbnailCard";const MyGenerations = ({ setToast }) => {  const [items, setItems] = useState([]);  const [loading, setLoading] = useState(true);  useEffect(() => {    const fetchData = async () => { 
Expand
JSX
1234567891011
import { useEffect, useState } from "react";import { api } from "../api/api";import LoadingSpinner from "../components/LoadingSpinner";import ThumbnailCard from "../components/ThumbnailCard";const Community = ({ setToast }) => {  const [items, setItems] = useState([]);  const [ideas, setIdeas] = useState([]);  const [loading, setLoading] = useState(true);  useEffect(() => { 
Expand
Frontend Step 10 — Auth Page
File: client/src/pages/AuthPage.jsx

JSX
123456789101112
import { useState } from "react";import { Link, useLocation, useNavigate } from "react-router-dom";import { api } from "../api/api";import { useAuth } from "../context/AuthContext";const AuthPage = ({ mode, setToast }) => {  const isLogin = mode === "login";  const navigate = useNavigate();  const location = useLocation();  const { saveAuth } = useAuth();  const [form, setForm] = useState({  
Expand
Frontend Step 11 — Reusable Presentation Components
Files: 
client/src/components/Navbar.jsx,
client/src/components/ThumbnailCard.jsx,
client/src/components/LoadingSpinner.jsx,
client/src/components/Toast.jsx,
client/src/components/Footer.jsx

These components provide the final UI shell, thumbnail cards, toast feedback, and loading states.

JSX
123456789101112
import { Link, NavLink, useNavigate } from "react-router-dom";import { useAuth } from "../context/AuthContext";const linkStyles = ({ isActive }) =>  `rounded-full px-4 py-2 text-sm transition ${    isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"  }`;const Navbar = () => {  const { user, isAuthenticated, logout } = useAuth();  const navigate = useNavigate();  
Expand
JSX
123456789101112
import { useState } from "react";import { resolveThumbnailUrl } from "../utils/thumbnailUrls";const ThumbnailCard = ({  item,  onDelete,  onLike,  showDelete = false,  showLike = false,  showAuthor = false}) => {  
Expand
JSX
12345678910
const LoadingSpinner = ({ text = "Loading..." }) => {  return (    <div className="flex flex-col items-center justify-center gap-3 py-12">      <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-purple/30 border-t-brand-pink" />      <p className="text-sm text-slate-300">{text}</p>    </div>  );};export default LoadingSpinner;
JSX
1234567891011
import { useEffect } from "react";const toastStyles = {  success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",  error: "border-rose-400/30 bg-rose-500/10 text-rose-200",  info: "border-cyan-400/30 bg-cyan-500/10 text-cyan-200"};const Toast = ({ toast, onClose }) => {  useEffect(() => {    if (!toast.message) { 
Expand
JSX
123456789101112
const Footer = () => {  return (    <footer className="border-t border-white/10 bg-slate-950/70">      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">        <p>© 2026 Thumblify. AI thumbnails for creators.</p>        <div className="flex gap-5">          <span>Fast prompts</span>          <span>JWT Auth</span>          <span>Community feed</span>        </div>      </div>  
Expand
Running the Complete Project
Backend
123
cd servernpm installnpm run dev
Frontend
123
cd clientnpm installnpm run dev
Default Local URLs
Frontend: http://localhost:5173
Backend API: http://127.0.0.1:5000
Final Workflow Recap
Sign up or log in.
Open the studio page.
Generate or recreate a thumbnail.
Review the preview and optimized prompt.
Browse the item later in My Generations.
Explore the Community page for public inspiration.



thumbnail-generator/
├── client/                       # Frontend (React + Vite + Tailwind CSS)
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js            # Global API fetch configuration
│   │   ├── components/           # Reusable presentation & layout components
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ThumbnailCard.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global Auth & Credits state
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx     # Main layout wrapper
│   │   ├── pages/                # Page views
│   │   │   ├── AuthPage.jsx
│   │   │   ├── Community.jsx
│   │   │   ├── Generate.jsx
│   │   │   ├── Home.jsx
│   │   │   └── MyGenerations.jsx
│   │   ├── utils/
│   │   │   ├── constants.js      # App constants (styles, aspect ratios, palettes)
│   │   │   └── thumbnailUrls.js  # Resolution and proxy resolver helper
│   │   ├── App.jsx               # Routes and App shell
│   │   ├── index.css             # Tailwind entries & global styling
│   │   └── main.jsx              # React mounting and context provider wraps
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                       # Backend (Express API)
│   ├── config/
│   │   └── db.js                 # Mongoose / MongoDB Atlas connection setup
│   ├── controllers/              # Request handlers
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   └── thumbnailController.js
│   ├── middleware/               # Route middleware
│   │   └── authMiddleware.js     # JWT extraction & authentication checks
│   ├── models/                   # Mongoose schemas
│   │   ├── Thumbnail.js
│   │   └── User.js
│   ├── routes/                   # Router mountings
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   └── thumbnailRoutes.js
│   ├── utils/                    # Helper utility files
│   │   ├── promptCache.js        # In-memory prompt optimization cache
│   │   ├── token.js              # Centralized JWT generation
│   │   └── thumbnailHelpers.js   # Groq and Pollinations API integration helpers
│   ├── .env.example              # Sample environment variables
│   ├── package.json
│   └── server.js                 # Application entry point
│
└── specs.md                      # Project specifications
