// endpoints/logout.ts
import { type Endpoint } from "payload";
import { tokenNames } from "../utilities/tokenNames.js";
import { getTokenFromRequest } from "../utilities/getTokenFromRequest.js";
import jwt from 'jsonwebtoken'


const {PAYLOADTOKEN,REFRESHTOKEN} = tokenNames()
export const logoutEndpoint: Endpoint = {
  path: "/logout",
  method: "post",
  handler: async (req) => {
    try {
      const payload = req.payload;
      //const user = req.user; // getting user this way is not reliable for admin UI

    const refreshToken = await getTokenFromRequest(req,REFRESHTOKEN) as string
   //if there no refreshToken return, no refresh token to clear
   // user not possibly logged in
   
     if (!refreshToken) {
        return Response.json({ ok: true }, { status: 200 });
      }

   const decoded = jwt.verify(refreshToken,payload.secret ) as jwt.JwtPayload
        const {userId} = decoded

         const findUser = await payload.find({
          collection: 'users',
          where:{
            id:{
              equals:userId
            }
          },
          limit:1
         })

       const userFromToken = findUser.docs[0]


      //get user from req or from refresh token which ever is defined
       const user = userFromToken ? userFromToken : req.user
      
      // -------------------------------------------------------------------
      // 1. Prevent multiple logouts and handle missing user
      // -------------------------------------------------------------------
      // If no user exists, simply return ok:true (idempotent logout)
   
      if (!user) {
        return Response.json({ ok: true }, { status: 200 });
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

      headers.append("Set-Cookie", `${REFRESHTOKEN}=; ${cookieFlags}`);
      headers.append("Set-Cookie", `${PAYLOADTOKEN}=; ${cookieFlags}`);

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
