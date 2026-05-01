import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";

// Inline KV store to avoid import issues
const getSupabaseClient = () =>
  createClient(
    Deno.env.get("SB_URL")!,
    Deno.env.get("SB_SERVICE_ROLE_KEY")!,
  );

const kv = {
  async get(key: string): Promise<any> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("kv_store_e75a6481")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      return data?.value;
    } catch (error) {
      console.error(`KV get error for key ${key}:`, error);
      throw error;
    }
  },

  async set(key: string, value: any): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("kv_store_e75a6481")
        .upsert({ key, value });
      if (error) throw error;
    } catch (error) {
      console.error(`KV set error for key ${key}:`, error);
      throw error;
    }
  },
};

const supabaseAdmin = () =>
  createClient(
    Deno.env.get("SB_URL")!,
    Deno.env.get("SB_SERVICE_ROLE_KEY")!,
  );
const postsTable = "posts_e75a6481";

const postsStore = {
  async list(): Promise<any[]> {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from(postsTable)
      .select("value")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data?.map((row: any) => row.value) ?? [];
  },

  async create(post: any): Promise<any> {
    const supabase = supabaseAdmin();
    const postWithId = {
      ...post,
      id: post.id || crypto.randomUUID(),
    };

    const { error } = await supabase.from(postsTable).insert({
      id: postWithId.id,
      value: postWithId,
    });

    if (error) throw error;
    return postWithId;
  },

  async replace(id: string, post: any): Promise<any> {
    const supabase = supabaseAdmin();
    const postWithId = { ...post, id };

    const { error } = await supabase
      .from(postsTable)
      .update({
        value: postWithId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
    return postWithId;
  },

  async patch(
    id: string,
    fields: Record<string, any>,
  ): Promise<any> {
    const supabase = supabaseAdmin();

    const { data: existing, error: fetchError } = await supabase
      .from(postsTable)
      .select("value")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!existing) return null;

    const updatedPost = {
      ...existing.value,
      ...fields,
      id,
    };

    const { error: updateError } = await supabase
      .from(postsTable)
      .update({
        value: updatedPost,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) throw updateError;
    return updatedPost;
  },
};

console.log("ENV CHECK:", {
  url: Deno.env.get("SB_URL"),
  key: Deno.env.get("SB_SERVICE_ROLE_KEY")
    ? "EXISTS"
    : "MISSING",
});

const app = new Hono();
const functionPath = "/make-server-e75a6481";

app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.use("*", logger(console.log));

app.get(functionPath, (c) => {
  return c.json({ message: "SMARTech Server Running" });
});

app.get(`${functionPath}/health`, (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      hasUrl: !!Deno.env.get("SB_URL"),
      hasKey: !!Deno.env.get("SB_SERVICE_ROLE_KEY"),
      url: Deno.env.get("SB_URL"),
    },
  });
});

app.get(`${functionPath}/test`, (c) => {
  return c.json({
    test: "success",
    timestamp: new Date().toISOString(),
  });
});

app.get(`${functionPath}/posts`, async (c) => {
  try {
    const posts = await postsStore.list();
    return c.json({ posts });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return c.json(
      {
        error: "Failed to fetch posts",
        details: error?.message || String(error),
        posts: [],
      },
      500,
    );
  }
});

app.post(`${functionPath}/posts`, async (c) => {
  try {
    const newPost = await c.req.json();
    const savedPost = await postsStore.create(newPost);

    return c.json({ success: true, post: savedPost });
  } catch (error) {
    console.error("Error adding post:", error);
    return c.json(
      { error: "Failed to add post", details: String(error) },
      500,
    );
  }
});

app.put(`${functionPath}/posts/:id`, async (c) => {
  try {
    const postId = c.req.param("id");
    const updatedPost = await c.req.json();
    const savedPost = await postsStore.replace(
      postId,
      updatedPost,
    );
    return c.json({ success: true, post: savedPost });
  } catch (error) {
    console.log("Error updating post:", error);
    return c.json({ error: "Failed to update post" }, 500);
  }
});

app.post(
  `${functionPath}/posts/:id/central-review`,
  async (c) => {
    try {
      const postId = c.req.param("id");
      const { centralReviewStatus, centralReviewComment } =
        await c.req.json();

      const updatedPost = await postsStore.patch(postId, {
        centralReviewStatus,
        centralReviewComment,
        centralReviewDate: new Date()
          .toISOString()
          .split("T")[0],
      });

      if (!updatedPost) {
        return c.json({ error: "Post not found" }, 404);
      }

      return c.json({ success: true });
    } catch (error) {
      console.log("Error reviewing post:", error);
      return c.json({ error: "Failed to review post" }, 500);
    }
  },
);

app.post(`${functionPath}/posts/:id/appeal`, async (c) => {
  try {
    const postId = c.req.param("id");
    const { appealComment } = await c.req.json();

    const updatedPost = await postsStore.patch(postId, {
      appealStatus: "Appealed",
      appealComment,
      appealDate: new Date().toISOString().split("T")[0],
    });

    if (!updatedPost) {
      return c.json({ error: "Post not found" }, 404);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log("Error appealing post:", error);
    return c.json({ error: "Failed to appeal post" }, 500);
  }
});

app.post(
  `${functionPath}/posts/:id/review-appeal`,
  async (c) => {
    try {
      const postId = c.req.param("id");
      const { approved, centralReviewComment } =
        await c.req.json();

      const updatedPost = await postsStore.patch(postId, {
        appealStatus: approved
          ? "Appeal Approved"
          : "Appeal Rejected",
        centralReviewStatus: approved
          ? "Good for Posting"
          : "For Revision",
        centralReviewComment,
        centralReviewDate: new Date()
          .toISOString()
          .split("T")[0],
      });

      if (!updatedPost) {
        return c.json({ error: "Post not found" }, 404);
      }

      return c.json({ success: true });
    } catch (error) {
      console.log("Error reviewing appeal:", error);
      return c.json({ error: "Failed to review appeal" }, 500);
    }
  },
);

app.get(
  `${functionPath}/profiles/by-email/:email`,
  async (c) => {
    try {
      const email = decodeURIComponent(c.req.param("email"))
        .trim()
        .toLowerCase();
      const supabase = supabaseAdmin();

      const { data, error } = await supabase
        .from("profiles")
        .select("email, office")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        return c.json({ error: error.message }, 500);
      }

      if (!data) {
        return c.json({ error: "Profile not found" }, 404);
      }

      return c.json({ profile: data });
    } catch (error: any) {
      return c.json(
        {
          error: "Failed to fetch profile",
          details: error?.message || String(error),
        },
        500,
      );
    }
  },
);

app.get(`${functionPath}/access-requests`, async (c) => {
  try {
    const requests = (await kv.get("access_requests")) || [];
    return c.json({ requests });
  } catch (error) {
    console.log("Error fetching access requests:", error);
    return c.json(
      { error: "Failed to fetch access requests" },
      500,
    );
  }
});

app.post(`${functionPath}/access-requests`, async (c) => {
  try {
    const newRequest = await c.req.json();
    const requests = (await kv.get("access_requests")) || [];
    const updatedRequests = [newRequest, ...requests];
    await kv.set("access_requests", updatedRequests);
    return c.json({ success: true, request: newRequest });
  } catch (error) {
    console.log("Error adding access request:", error);
    return c.json(
      { error: "Failed to add access request" },
      500,
    );
  }
});

app.put(`${functionPath}/access-requests/:id`, async (c) => {
  try {
    const requestId = c.req.param("id");
    const { status, verificationCode } = await c.req.json();
    const requests = (await kv.get("access_requests")) || [];

    let verificationCodeExpiresAt;
    if (verificationCode) {
      const expirationDate = new Date();
      expirationDate.setMinutes(
        expirationDate.getMinutes() + 15,
      );
      verificationCodeExpiresAt = expirationDate.toISOString();
    }

    const updatedRequests = requests.map((req: any) =>
      req.id === requestId
        ? {
            ...req,
            status,
            verificationCode,
            verificationCodeExpiresAt,
          }
        : req,
    );

    await kv.set("access_requests", updatedRequests);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error updating access request:", error);
    return c.json(
      { error: "Failed to update access request" },
      500,
    );
  }
});

app.post(
  `${functionPath}/access-requests/:id/approve-create-account`,
  async (c) => {
    try {
      const requestId = c.req.param("id");
      const requests = (await kv.get("access_requests")) || [];
      const request = requests.find(
        (req: any) => req.id === requestId,
      );

      if (!request) {
        return c.json({ error: "Request not found" }, 404);
      }

      if (request.type !== "create-account") {
        return c.json(
          { error: "Request is not a create-account request" },
          400,
        );
      }

      const supabase = supabaseAdmin();

      const accountPasswordCounter = Number(
        (await kv.get("account_password_counter")) || 0,
      );

      const nextPasswordNumber = accountPasswordCounter + 1;
      const temporaryPassword = `nycsmartech${nextPasswordNumber}`;

      const { data: createdUser, error: createError } =
        await supabase.auth.admin.createUser({
          email: request.officeEmail,
          password: temporaryPassword,
          email_confirm: true,
        });

      if (createError || !createdUser.user) {
        return c.json(
          {
            error:
              createError?.message || "Failed to create user",
          },
          500,
        );
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: createdUser.user.id,
          email: request.officeEmail,
          office: request.officeName,
          role: "user",
        });

      if (profileError) {
        return c.json({ error: profileError.message }, 500);
      }

      await kv.set(
        "account_password_counter",
        nextPasswordNumber,
      );

      const updatedRequests = requests.map((req: any) =>
        req.id === requestId
          ? {
              ...req,
              status: "Approved",
              requestedPassword: temporaryPassword,
            }
          : req,
      );

      await kv.set("access_requests", updatedRequests);

      return c.json({
        success: true,
        email: request.officeEmail,
        temporaryPassword,
      });
    } catch (error: any) {
      console.error("Error approving create account:", error);
      return c.json(
        {
          error: "Failed to approve create account",
          details: error?.message || String(error),
        },
        500,
      );
    }
  },
);

app.get(
  `${functionPath}/access-requests/verify/:code`,
  async (c) => {
    try {
      const code = c.req.param("code");
      const requests = (await kv.get("access_requests")) || [];
      const request = requests.find(
        (req: any) =>
          req.verificationCode === code &&
          req.status === "Approved",
      );

      if (!request) {
        return c.json(
          { error: "Invalid or expired verification code" },
          404,
        );
      }

      if (request.verificationCodeExpiresAt) {
        const expirationTime = new Date(
          request.verificationCodeExpiresAt,
        );
        const currentTime = new Date();

        if (currentTime > expirationTime) {
          return c.json(
            {
              error:
                "Verification code has expired. Please request a new one.",
            },
            410,
          );
        }
      }

      return c.json({ request });
    } catch (error) {
      console.log("Error verifying code:", error);
      return c.json({ error: "Failed to verify code" }, 500);
    }
  },
);

app.post(`${functionPath}/auth/update-password`, async (c) => {
  try {
    const { email, newPassword } = await c.req.json();

    if (!email || !newPassword) {
      return c.json(
        { error: "Email and new password are required" },
        400,
      );
    }

    const supabase = supabaseAdmin();
    const { data, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      console.log("Error listing users:", listError);
      return c.json({ error: "Failed to find user" }, 500);
    }

    const user = data.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase(),
    );

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const { error: updateError } =
      await supabase.auth.admin.updateUserById(user.id, {
        password: newPassword,
      });

    if (updateError) {
      console.log("Error updating password:", updateError);
      return c.json(
        { error: "Failed to update password" },
        500,
      );
    }

    return c.json({ success: true });
  } catch (error) {
    console.log("Error updating password:", error);
    return c.json({ error: "Failed to update password" }, 500);
  }
});

app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json(
    {
      error: "Internal server error",
      message: err.message,
      stack: err.stack,
    },
    500,
  );
});

app.notFound((c) => {
  console.log("404 - Path not found:", c.req.url);
  return c.json({ error: "Not found", path: c.req.path }, 404);
});

Deno.serve(app.fetch);