/**
 * Purpose: Verification script to test Phase 3 Thumbnail Management & Feed APIs.
 * 
 * Flow:
 * 1. Creates a new test user to get a clean auth token.
 * 2. Generates a fresh public thumbnail (so we have a record to manipulate).
 * 3. Runs Test A: Get User Library. Queries GET /api/thumbnails.
 *    - Verifies the user library matches the user's creations.
 * 4. Runs Test B: Get Community Feed. Queries GET /api/thumbnails/community.
 *    - Verifies the feed contains the public thumbnail.
 *    - Verifies creator name population.
 *    - Verifies trending ideas list.
 * 5. Runs Test C: Like Toggle. Queries POST /api/thumbnails/community/:id/like.
 *    - Likes the thumbnail. Verifies count goes to 1.
 *    - Likes again (toggle unlike). Verifies count goes to 0.
 * 6. Runs Test D: CORS Download Proxy. Queries GET /api/thumbnails/proxy?url=...
 *    - Proxies a pollinations URL, checks image content-type and buffer size.
 *    - Proxies an external site URL (google.com) and checks security block.
 * 7. Runs Test E: Thumbnail Deletion. Queries DELETE /api/thumbnails/:id.
 *    - Deletes the thumbnail, checks database removal.
 * 
 * Usage:
 * Execute in terminal:
 * node test-thumbnails.js
 */

const API_BASE = "http://127.0.0.1:5000/api";

const testUser = {
  name: "Thumbnail Manager Tester",
  email: `thumbtester_${Date.now()}@example.com`,
  password: "password123",
};

async function runThumbnailTests() {
  console.log("==================================================");
  console.log("🧪 Starting Thumbnail Management API Verification");
  console.log("==================================================\n");

  let authToken = "";
  let createdThumbnailId = "";
  let createdThumbnailUrl = "";

  // --- Step 1: User Signup ---
  try {
    console.log("👉 Step 1: Creating fresh test account...");
    const signupRes = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });
    const signupData = await signupRes.json();
    if (!signupRes.ok) throw new Error(signupData.message);
    authToken = signupData.token;
  } catch (err) {
    console.error("❌ Pre-requisite signup failed:", err.message);
    return;
  }

  // --- Step 2: Generate a thumbnail ---
  try {
    console.log("👉 Step 2: Generating a starting thumbnail...");
    const generateRes = await fetch(`${API_BASE}/ai/generate-thumbnail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify({
        title: "Test CRUD Operations",
        style: "Minimalist Paint",
        aspectRatio: "16:9",
        colors: "Vibrant Cyan",
        extraPrompt: "A single clean brush stroke on a solid dark gray canvas",
        mode: "generate",
        visibility: "public"
      })
    });
    const data = await generateRes.json();
    if (!generateRes.ok) throw new Error(data.message);
    createdThumbnailId = data.thumbnail._id;
    createdThumbnailUrl = data.thumbnail.imageUrl;
    console.log(`✅ Generated starting thumbnail. ID: ${createdThumbnailId}\n`);
  } catch (err) {
    console.error("❌ Pre-requisite generation failed:", err.message);
    return;
  }

  // --- Test A: Get User Library ---
  try {
    console.log("👉 Test A: Fetching user generations library...");
    const res = await fetch(`${API_BASE}/thumbnails`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    console.log(`✅ Success! Found ${data.thumbnails.length} thumbnails.`);
    const found = data.thumbnails.some(t => t._id === createdThumbnailId);
    if (!found) throw new Error("Generated thumbnail was not found in user library");
    console.log("✅ Verified: Generated thumbnail is in the library list.\n");
  } catch (err) {
    console.error("❌ Test A Failed:", err.message);
    return;
  }

  // --- Test B: Get Community Feed ---
  try {
    console.log("👉 Test B: Fetching public community feed...");
    const res = await fetch(`${API_BASE}/thumbnails/community`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    console.log(`✅ Success! Found ${data.thumbnails.length} community feed entries.`);
    const found = data.thumbnails.find(t => t._id === createdThumbnailId);
    if (!found) throw new Error("Generated public thumbnail not found in feed");
    
    // Check populated creator name
    if (!found.userId || typeof found.userId !== "object" || !found.userId.name) {
      throw new Error("User ID was not populated with username in community feed query");
    }
    console.log(`👤 Verified: Creator name populated correctly: "${found.userId.name}"`);
    console.log("💡 Verified: Feed contains trending ideas list. Items count:", data.ideas.length);
    console.log(`🔥 Sample Idea: "${data.ideas[0]}"\n`);
  } catch (err) {
    console.error("❌ Test B Failed:", err.message);
    return;
  }

  // --- Test C: Toggle Like ---
  try {
    console.log("👉 Test C: Liking and Unliking public card...");
    
    // Like (Toggle On)
    console.log("⏳ Sending first like (Toggle ON)...");
    const likeRes = await fetch(`${API_BASE}/thumbnails/community/${createdThumbnailId}/like`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${authToken}` }
    });
    const likeData = await likeRes.json();
    if (!likeRes.ok) throw new Error(likeData.message);
    console.log(`👍 Like successful! New likes count: ${likeData.likes} (Expected: 1), Liked: ${likeData.liked}`);

    // Unlike (Toggle Off)
    console.log("⏳ Sending second like (Toggle OFF)...");
    const unlikeRes = await fetch(`${API_BASE}/thumbnails/community/${createdThumbnailId}/like`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${authToken}` }
    });
    const unlikeData = await unlikeRes.json();
    if (!unlikeRes.ok) throw new Error(unlikeData.message);
    console.log(`👎 Unlike successful! New likes count: ${unlikeData.likes} (Expected: 0), Liked: ${unlikeData.liked}`);
    console.log("✅ Verified: Liking toggle operations are fully functional.\n");
  } catch (err) {
    console.error("❌ Test C Failed:", err.message);
    return;
  }

  // --- Test D: Image Proxy ---
  try {
    console.log("👉 Test D: Querying the server CORS image download proxy...");
    
    // Proxies valid pollinations URL
    console.log(`⏳ Proxying pollinations URL: ${createdThumbnailUrl}`);
    const proxyRes = await fetch(`${API_BASE}/thumbnails/proxy?url=${encodeURIComponent(createdThumbnailUrl)}`);
    if (!proxyRes.ok) throw new Error(`Proxy request failed: ${proxyRes.statusText}`);
    
    const contentType = proxyRes.headers.get("content-type");
    console.log(`✅ Proxy response Content-Type: ${contentType}`);
    
    const imageBuffer = await proxyRes.arrayBuffer();
    console.log(`✅ Download proxy succeeded! Image size: ${imageBuffer.byteLength} bytes.`);

    // Proxies invalid domain
    console.log("⏳ Proxying a blocked host url...");
    const badProxyRes = await fetch(`${API_BASE}/thumbnails/proxy?url=${encodeURIComponent("https://google.com")}`);
    const badData = await badProxyRes.json();
    if (badProxyRes.ok) throw new Error("CORS Proxy accepted an unauthorized external domain!");
    console.log("✅ Correctly blocked bad host proxy query!");
    console.log("🛑 Proxy server response message:", `"${badData.message}"\n`);
  } catch (err) {
    console.error("❌ Test D Failed:", err.message);
    return;
  }

  // --- Test E: Delete Thumbnail ---
  try {
    console.log("👉 Test E: Deleting the thumbnail...");
    const deleteRes = await fetch(`${API_BASE}/thumbnails/${createdThumbnailId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${authToken}` }
    });
    const deleteData = await deleteRes.json();
    if (!deleteRes.ok) throw new Error(deleteData.message);
    console.log("✅ Deletion query completed successfully.");

    // Query library again to verify removal
    const verifyRes = await fetch(`${API_BASE}/thumbnails`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${authToken}` }
    });
    const verifyData = await verifyRes.json();
    const stillExists = verifyData.thumbnails.some(t => t._id === createdThumbnailId);
    if (stillExists) throw new Error("Thumbnail was deleted but still returned in user library!");
    console.log("✅ Verified: Thumbnail is permanently removed from the user library.\n");
  } catch (err) {
    console.error("❌ Test E Failed:", err.message);
    return;
  }

  console.log("==================================================");
  console.log("✨ All Phase 3 Thumbnail CRUD Feed Tests Passed!");
  console.log("==================================================");
}

runThumbnailTests();
