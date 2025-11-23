// endpoints/logout.ts
import { type Endpoint } from "payload";

//export const createLogout = (options: PluginOptions): Endpoint => {
  export const logoutEndpoint: Endpoint = {
    path: "/logout",
    method: "post",
    handler: async (req) => {

      try {
        const payload = req.payload;
        const user = req.user;

           //The line below prevent multiple logout in one logout request
      //if(!req.user) return Response.json({message:"no user found"}) 
       if(!req.user) return Response.json({ok:true},{status:201})
      //console.log("✅ Using custom logout endpoint");
      //console.log('USER IS: ',req.user)

        //check if users is still logged in by checking
        // if refresh token id exist
        
        const tokenIdExist = await req.payload.find({
        collection:'refresh-token',
        where:{
         id: {
            equals:req.user?.id
         }  
        },
        limit: 1
    })
    const refreshTokenIdExist = tokenIdExist.docs.length > 0

    

       if(!(user&&refreshTokenIdExist)) throw new Error("No user exist")


        // ✅ Store user reference BEFORE clearing anything
        const userForHooks = user;

        // Create proper header container
        const headers = new Headers({
          "Content-Type": "application/json",
        });

        // ✅ Clear cookies
        const cookieOptions =
          process.env.NODE_ENV === "production"
            ? "HttpOnly; Path=/; SameSite=Lax; Secure; Max-Age=0"
            : "HttpOnly; Path=/; SameSite=Lax; Max-Age=0";

        headers.append("Set-Cookie", `payload-token=; ${cookieOptions}`);
        headers.append("Set-Cookie", `refreshToken=; ${cookieOptions}`);
        //req.user = null


        // ✅ Get hooks consistently - try both methods
        let afterLogoutHooks: any[] = [];

        // Method 1: Try via collections access (more reliable)
        const usersCollection = payload.collections.users;
        if (usersCollection?.config?.hooks?.afterLogout) {
          const hooks = usersCollection.config.hooks.afterLogout;
          afterLogoutHooks = Array.isArray(hooks) ? hooks : [hooks];
        }
        // Method 2: Fallback to config access
        else {
          const usersConfig = payload.config.collections.find(
            (c) => c.slug === "users"
          );
          if (usersConfig?.hooks?.afterLogout) {
            const hooks = usersConfig.hooks.afterLogout;
            afterLogoutHooks = Array.isArray(hooks) ? hooks : [hooks];
          }
        }

        // ✅ Run afterLogout hooks with proper error handling
        if (afterLogoutHooks.length > 0 && userForHooks) {
         // console.log(`🔄 Running ${afterLogoutHooks.length} afterLogout hooks`);

          for (const hook of afterLogoutHooks) {
            try {
              if (typeof hook === 'function') {
                await hook({ user: userForHooks, req });
               // console.log("✅ afterLogout hook executed successfully");
              }


            } catch (hookError) {
              // Log error but don't break logout process
              console.error("❌ afterLogout hook failed:", hookError);
              // Continue with other hooks
            }
          }
        } else if (!userForHooks) {
          console.log("ℹ️  No user found, skipping afterLogout hooks");
        }

        // ✅ Return standard JSON response
        return new Response(
          JSON.stringify({ message: "Logged out successfully" }),
          {
            status: 200,
            headers,
          }
        );
      } catch (error) {
        console.error("❌ Logout error:", error);
        return new Response(
          JSON.stringify({ 
            message: "Logout failed", 
            error: error instanceof Error ? error.message : String(error) 
          }),
          { status: 500 }
        );
      }
    },
  };

