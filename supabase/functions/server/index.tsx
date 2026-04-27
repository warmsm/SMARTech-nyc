import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-e75a6481/health", (c) => {
  return c.json({ status: "ok" });
});

// ============= POSTS ENDPOINTS =============

// Get all posts
app.get("/make-server-e75a6481/posts", async (c) => {
  try {
    const posts = await kv.get("posts") || [];
    return c.json({ posts });
  } catch (error) {
    console.log("Error fetching posts:", error);
    return c.json({ error: "Failed to fetch posts" }, 500);
  }
});

// Add a new post
app.post("/make-server-e75a6481/posts", async (c) => {
  try {
    const newPost = await c.req.json();
    const posts = await kv.get("posts") || [];
    const updatedPosts = [newPost, ...posts];
    await kv.set("posts", updatedPosts);
    return c.json({ success: true, post: newPost });
  } catch (error) {
    console.log("Error adding post:", error);
    return c.json({ error: "Failed to add post" }, 500);
  }
});

// Update a post
app.put("/make-server-e75a6481/posts/:id", async (c) => {
  try {
    const postId = c.req.param("id");
    const updatedPost = await c.req.json();
    const posts = await kv.get("posts") || [];
    const updatedPosts = posts.map((post: any) =>
      post.id === postId ? updatedPost : post
    );
    await kv.set("posts", updatedPosts);
    return c.json({ success: true, post: updatedPost });
  } catch (error) {
    console.log("Error updating post:", error);
    return c.json({ error: "Failed to update post" }, 500);
  }
});

// Central review a post
app.post("/make-server-e75a6481/posts/:id/central-review", async (c) => {
  try {
    const postId = c.req.param("id");
    const { centralReviewStatus, centralReviewComment } = await c.req.json();
    const posts = await kv.get("posts") || [];
    const updatedPosts = posts.map((post: any) =>
      post.id === postId
        ? {
            ...post,
            centralReviewStatus,
            centralReviewComment,
            centralReviewDate: new Date().toISOString().split("T")[0],
          }
        : post
    );
    await kv.set("posts", updatedPosts);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error reviewing post:", error);
    return c.json({ error: "Failed to review post" }, 500);
  }
});

// Appeal a post
app.post("/make-server-e75a6481/posts/:id/appeal", async (c) => {
  try {
    const postId = c.req.param("id");
    const { appealComment } = await c.req.json();
    const posts = await kv.get("posts") || [];
    const updatedPosts = posts.map((post: any) =>
      post.id === postId
        ? {
            ...post,
            appealStatus: "Appealed",
            appealComment,
            appealDate: new Date().toISOString().split("T")[0],
          }
        : post
    );
    await kv.set("posts", updatedPosts);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error appealing post:", error);
    return c.json({ error: "Failed to appeal post" }, 500);
  }
});

// Review appeal
app.post("/make-server-e75a6481/posts/:id/review-appeal", async (c) => {
  try {
    const postId = c.req.param("id");
    const { approved, centralReviewComment } = await c.req.json();
    const posts = await kv.get("posts") || [];
    const updatedPosts = posts.map((post: any) =>
      post.id === postId
        ? {
            ...post,
            appealStatus: approved ? "Appeal Approved" : "Appeal Rejected",
            centralReviewStatus: approved ? "Good for Posting" : "For Revision",
            centralReviewComment,
            centralReviewDate: new Date().toISOString().split("T")[0],
          }
        : post
    );
    await kv.set("posts", updatedPosts);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error reviewing appeal:", error);
    return c.json({ error: "Failed to review appeal" }, 500);
  }
});

// ============= ACCESS REQUESTS ENDPOINTS =============

// Get all access requests
app.get("/make-server-e75a6481/access-requests", async (c) => {
  try {
    const requests = await kv.get("access_requests") || [];
    return c.json({ requests });
  } catch (error) {
    console.log("Error fetching access requests:", error);
    return c.json({ error: "Failed to fetch access requests" }, 500);
  }
});

// Add a new access request
app.post("/make-server-e75a6481/access-requests", async (c) => {
  try {
    const newRequest = await c.req.json();
    const requests = await kv.get("access_requests") || [];
    const updatedRequests = [newRequest, ...requests];
    await kv.set("access_requests", updatedRequests);
    return c.json({ success: true, request: newRequest });
  } catch (error) {
    console.log("Error adding access request:", error);
    return c.json({ error: "Failed to add access request" }, 500);
  }
});

// Update an access request
app.put("/make-server-e75a6481/access-requests/:id", async (c) => {
  try {
    const requestId = c.req.param("id");
    const { status, verificationCode } = await c.req.json();
    const requests = await kv.get("access_requests") || [];

    // Set expiration time to 15 minutes from now if verification code is provided
    let verificationCodeExpiresAt;
    if (verificationCode) {
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 15);
      verificationCodeExpiresAt = expirationDate.toISOString();
    }

    const updatedRequests = requests.map((req: any) =>
      req.id === requestId
        ? { ...req, status, verificationCode, verificationCodeExpiresAt }
        : req
    );
    await kv.set("access_requests", updatedRequests);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error updating access request:", error);
    return c.json({ error: "Failed to update access request" }, 500);
  }
});

// Get request by verification code
app.get("/make-server-e75a6481/access-requests/verify/:code", async (c) => {
  try {
    const code = c.req.param("code");
    const requests = await kv.get("access_requests") || [];
    const request = requests.find((req: any) =>
      req.verificationCode === code && req.status === "Approved"
    );

    if (!request) {
      return c.json({ error: "Invalid or expired verification code" }, 404);
    }

    // Check if verification code has expired (15 minutes)
    if (request.verificationCodeExpiresAt) {
      const expirationTime = new Date(request.verificationCodeExpiresAt);
      const currentTime = new Date();

      if (currentTime > expirationTime) {
        return c.json({ error: "Verification code has expired. Please request a new one." }, 410);
      }
    }

    return c.json({ request });
  } catch (error) {
    console.log("Error verifying code:", error);
    return c.json({ error: "Failed to verify code" }, 500);
  }
});

// ============= AUTH ENDPOINTS =============

// Update password
app.post("/make-server-e75a6481/auth/update-password", async (c) => {
  try {
    const { email, newPassword } = await c.req.json();
    const passwords = await kv.get("custom_passwords") || {};
    passwords[email] = newPassword;
    await kv.set("custom_passwords", passwords);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error updating password:", error);
    return c.json({ error: "Failed to update password" }, 500);
  }
});

// Get custom password for email
app.get("/make-server-e75a6481/auth/password/:email", async (c) => {
  try {
    const email = c.req.param("email");
    const passwords = await kv.get("custom_passwords") || {};
    const customPassword = passwords[email];
    return c.json({ customPassword });
  } catch (error) {
    console.log("Error fetching password:", error);
    return c.json({ error: "Failed to fetch password" }, 500);
  }
});

Deno.serve(app.fetch);