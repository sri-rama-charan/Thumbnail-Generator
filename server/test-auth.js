/**
 * Purpose: Verification script to test Phase 1 Authentication APIs.
 * 
 * Flow:
 * 1. Checks if the server is running by calling GET /api/health.
 * 2. Attempts to sign up a new test user using POST /api/auth/signup.
 * 3. Attempts to log in using the same credentials with POST /api/auth/login.
 * 4. Attempts to retrieve the profile of the user using GET /api/auth/me.
 * 
 * Usage:
 * Ensure the server is running (npm run dev) and then execute:
 * node test-auth.js
 */

const API_BASE = "http://127.0.0.1:5000/api";

const testUser = {
  name: "Test User",
  email: `tester_${Date.now()}@example.com`, // Unique email per run
  password: "password123",
};

async function runTests() {
  console.log("=========================================");
  console.log("🧪 Starting Authentication API Verification");
  console.log("=========================================\n");

  // --- Test 1: Health Check ---
  try {
    console.log("👉 Test 1: Checking server health...");
    const healthRes = await fetch(`${API_BASE}/health`);
    if (!healthRes.ok) throw new Error("Health check returned non-200 code");
    const healthData = await healthRes.json();
    console.log("✅ Health Check successful:", healthData.message);
  } catch (err) {
    console.error("❌ Test 1 Failed: Could not connect to the server.");
    console.error("Make sure your Express server is running on http://127.0.0.1:5000");
    return;
  }

  // --- Test 2: User Signup ---
  let authToken = "";
  try {
    console.log("\n👉 Test 2: Attempting user signup...");
    const signupRes = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });
    
    const signupData = await signupRes.json();
    if (!signupRes.ok) {
      throw new Error(signupData.message || "Signup failed");
    }
    
    console.log("✅ Signup successful!");
    console.log("🔑 JWT Token received:", signupData.token ? "Yes (Masked)" : "No");
    console.log("💳 Start Credits:", signupData.user.credits);
    authToken = signupData.token;
  } catch (err) {
    console.error("❌ Test 2 Failed:", err.message);
    return;
  }

  // --- Test 3: User Login ---
  try {
    console.log("\n👉 Test 3: Attempting user login...");
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      throw new Error(loginData.message || "Login failed");
    }

    console.log("✅ Login successful!");
    console.log("🔑 JWT Token received:", loginData.token ? "Yes (Masked)" : "No");
    console.log("💳 User Credits:", loginData.user.credits);
    authToken = loginData.token; // Update token
  } catch (err) {
    console.error("❌ Test 3 Failed:", err.message);
    return;
  }

  // --- Test 4: Profile Restoration (/me) ---
  try {
    console.log("\n👉 Test 4: Fetching user profile via authentication middleware...");
    const profileRes = await fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
    });

    const profileData = await profileRes.json();
    if (!profileRes.ok) {
      throw new Error(profileData.message || "Profile fetch failed");
    }

    console.log("✅ Profile retrieval successful!");
    console.log("👤 User details retrieved:", JSON.stringify(profileData.user, null, 2));
  } catch (err) {
    console.error("❌ Test 4 Failed:", err.message);
    return;
  }

  console.log("\n=========================================");
  console.log("✨ All Phase 1 Authentication API Tests Passed!");
  console.log("=========================================");
}

runTests();
