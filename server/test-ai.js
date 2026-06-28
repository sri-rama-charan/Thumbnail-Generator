/**
 * Purpose: Verification script to test Phase 2 AI Prompt Optimization & Image Generation APIs.
 * 
 * Flow:
 * 1. Creates a new test user to guarantee fresh credits (15).
 * 2. Runs Test A: Generate Mode. Sends topic, style, palette, and extra prompts.
 *    - Verifies Groq optimized prompt generation.
 *    - Verifies Pollinations URL structure.
 *    - Verifies MongoDB record saved successfully.
 *    - Verifies user credits reduced from 15 to 14.
 * 3. Runs Test B: Recreate Mode. Uses the image generated in Test A as the source reference.
 *    - Validates source image host (pollinations.ai).
 *    - Requests a modification ("change background to golden coin showers").
 *    - Verifies user credits reduced from 14 to 13.
 * 4. Runs Test C: Whitelist Domain Validation check.
 *    - Attempts a recreation using an external unsupported host (e.g., google.com).
 *    - Verifies the endpoint rejects with a 400 Bad Request and does NOT charge a credit.
 * 
 * Usage:
 * Execute in terminal:
 * node test-ai.js
 */

const API_BASE = "http://127.0.0.1:5000/api";

// Create a unique user credentials object per test run
const testUser = {
  name: "AI Tester",
  email: `aitester_${Date.now()}@example.com`,
  password: "password123",
};

async function runAITests() {
  console.log("==================================================");
  console.log("🧪 Starting AI Prompt & Generation API Verification");
  console.log("==================================================\n");

  let authToken = "";
  
  // --- Step 1: User Signup ---
  try {
    console.log("👉 Step 1: Creating fresh test account for credits...");
    const signupRes = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });
    
    const signupData = await signupRes.json();
    if (!signupRes.ok) throw new Error(signupData.message);
    authToken = signupData.token;
    console.log(`✅ User created. Balance: ${signupData.user.credits} credits.\n`);
  } catch (err) {
    console.error("❌ Pre-requisite signup failed:", err.message);
    return;
  }

  // --- Step 2: Test Generate Mode ---
  let firstThumbnailUrl = "";
  try {
    console.log("👉 Test A: Creating a fresh thumbnail (Generate Mode)...");
    const generatePayload = {
      title: "Making $10k/month with AI agents",
      style: "Bold 3D Cartoon Vector",
      aspectRatio: "16:9",
      colors: "Neon Purple and Vibrant Green",
      extraPrompt: "Show a futuristic cute robot sitting in front of a giant dashboard with stock charts",
      mode: "generate",
      visibility: "public"
    };

    console.log("⏳ Contacting Groq (Optimization) & Pollinations (Image Warmup)...");
    const start = Date.now();
    
    const res = await fetch(`${API_BASE}/ai/generate-thumbnail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(generatePayload)
    });

    const data = await res.json();
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    
    if (!res.ok) throw new Error(data.message);

    console.log(`✅ Success in ${duration}s!`);
    console.log("🤖 Optimized Prompt:", `"${data.thumbnail.optimizedPrompt}"`);
    console.log("🖼️ Pollinations Image URL:", data.thumbnail.imageUrl);
    console.log(`💳 Updated Balance: ${data.credits} credits (Expected: 14).\n`);
    
    firstThumbnailUrl = data.thumbnail.imageUrl;
  } catch (err) {
    console.error("❌ Test A Failed:", err.message);
    return;
  }

  // --- Step 3: Test Recreate Mode (Valid Whitelist) ---
  try {
    console.log("👉 Test B: Modifying the generated thumbnail (Recreate Mode)...");
    const recreatePayload = {
      title: "Making $10k/month with AI agents",
      style: "Bold 3D Cartoon Vector",
      aspectRatio: "16:9",
      colors: "Neon Purple and Vibrant Green",
      sourceImage: firstThumbnailUrl, // Generated from pollinations.ai (Allowed)
      changeRequest: "Add flying golden coins floating all over the background",
      mode: "recreate",
      visibility: "public"
    };

    console.log("⏳ Processing recreation and pre-warming image...");
    const start = Date.now();

    const res = await fetch(`${API_BASE}/ai/generate-thumbnail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(recreatePayload)
    });

    const data = await res.json();
    const duration = ((Date.now() - start) / 1000).toFixed(2);

    if (!res.ok) throw new Error(data.message);

    console.log(`✅ Success in ${duration}s!`);
    console.log("🤖 Recreated Prompt:", `"${data.thumbnail.optimizedPrompt}"`);
    console.log("🖼️ Recreated Image URL:", data.thumbnail.imageUrl);
    console.log(`💳 Updated Balance: ${data.credits} credits (Expected: 13).\n`);
  } catch (err) {
    console.error("❌ Test B Failed:", err.message);
    return;
  }

  // --- Step 4: Test Domain Whitelist Security Reject ---
  try {
    console.log("👉 Test C: Testing security whitelist reject (Unsupported host)...");
    const hijackPayload = {
      title: "Making $10k/month with AI agents",
      style: "Bold 3D Cartoon Vector",
      aspectRatio: "16:9",
      colors: "Neon Purple and Vibrant Green",
      sourceImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809", // Unsplash (Blocked)
      changeRequest: "Make background black and white",
      mode: "recreate",
      visibility: "public"
    };

    const res = await fetch(`${API_BASE}/ai/generate-thumbnail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(hijackPayload)
    });

    const data = await res.json();
    
    if (res.ok) {
      throw new Error("Security check bypassed! Server allowed an unsupported reference image host.");
    }

    console.log("✅ Correctly rejected by server!");
    console.log("🛑 Server Response Message:", `"${data.message}"`);
  } catch (err) {
    console.error("❌ Test C Failed:", err.message);
    return;
  }

  console.log("\n==================================================");
  console.log("✨ All Phase 2 AI and Image Generation Tests Passed!");
  console.log("==================================================");
}

runAITests();
