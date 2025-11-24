// endpoints/logout.ts
import { type Endpoint } from "payload";

export const logoutEndpoint: Endpoint = {
  path: "/logout",
  method: "post",
  handler: async (req) => {
    try {
      const payload = req.payload;
      const user = req.user;

      // -------------------------------------------------------------------
      // 1. Prevent multiple logouts and handle missing user
      // -------------------------------------------------------------------
      // If no user exists, simply return ok:true (idempotent logout)
      if (!user) {
        return Response.json({ ok: true }, { status: 200 });
      }

      // -------------------------------------------------------------------
      // 2. Verify the refresh-token entry still exists
      // Prevents logging out users who have already revoked their tokens
      // -------------------------------------------------------------------
      const tokenLookup = await payload.find({
        collection: "refresh-token",
        where: {
          id: { equals: user.id },
        },
        limit: 1,
      });

      const hasRefreshToken = tokenLookup.docs.length > 0;

      if (!hasRefreshToken) {
        throw new Error("No active refresh token found for user");
      }

      // Store the user reference for hooks BEFORE clearing anything
      const userForHooks = user;

      // -------------------------------------------------------------------
      // 3. Prepare and clear relevant cookies
      // -------------------------------------------------------------------
      const headers = new Headers({ "Content-Type": "application/json" });

      // Cookie clearing template
      const cookieFlags =
        process.env.NODE_ENV === "production"
          ? "HttpOnly; Path=/; SameSite=Lax; Secure; Max-Age=0"
          : "HttpOnly; Path=/; SameSite=Lax; Max-Age=0";

      headers.append("Set-Cookie", `payload-token=; ${cookieFlags}`);
      headers.append("Set-Cookie", `refreshToken=; ${cookieFlags}`);

      // -------------------------------------------------------------------
      // 4. Locate afterLogout hooks (Payload v3 requires manual execution)
      // -------------------------------------------------------------------
      let afterLogoutHooks: any[] = [];

      // Method 1: Access hooks through payload.collections
      const usersCollection = payload.collections?.users;
      if (usersCollection?.config?.hooks?.afterLogout) {
        const rawHooks = usersCollection.config.hooks.afterLogout;
        afterLogoutHooks = Array.isArray(rawHooks) ? rawHooks : [rawHooks];
      } else {
        // Method 2: Fallback to payload.config
        const usersConfig = payload.config.collections.find(
          (c) => c.slug === "users"
        );
        if (usersConfig?.hooks?.afterLogout) {
          const rawHooks = usersConfig.hooks.afterLogout;
          afterLogoutHooks = Array.isArray(rawHooks) ? rawHooks : [rawHooks];
        }
      }

      // -------------------------------------------------------------------
      // 5. Execute afterLogout hooks safely
      // -------------------------------------------------------------------
      for (const hook of afterLogoutHooks) {
        try {
          if (typeof hook === "function") {
            await hook({ user: userForHooks, req });
          }
        } catch (hookError) {
          // Hooks must never break logout flow
          console.error("afterLogout hook failed:", hookError);
        }
      }

      // -------------------------------------------------------------------
      // 6. Return success response
      // -------------------------------------------------------------------
      return new Response(
        JSON.stringify({ message: "Logged out successfully" }),
        { status: 200, headers }
      );
    } catch (error) {
      console.error("Logout error:", error);

      return new Response(
        JSON.stringify({
          message: "Logout failed",
          error: error instanceof Error ? error.message : String(error),
        }),
        { status: 500 }
      );
    }
  },
};
