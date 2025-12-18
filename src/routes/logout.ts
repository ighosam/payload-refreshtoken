// endpoints/logout.ts
import { PayloadRequest, TypedUser, type Endpoint } from "payload";
import { tokenNames } from "../utilities/tokenNames";
import { getTokenFromRequest } from "../utilities/getTokenFromRequest";
import jwt from 'jsonwebtoken'
import { deleteRefreshTokenId } from "../utilities/deleteRefreshTokenId";

const {PAYLOADTOKEN,REFRESHTOKEN} = tokenNames()
export const logoutEndpoint: Endpoint = {
  path: "/logout",
  method: "post",
  handler: async (req) => {

const payload = req.payload; 
//================================
// Get user from request
//================================== 
const getUserFromReq = async (req:PayloadRequest) =>{
      if(req.user != undefined || req.user != null) return req.user      
      //const user = req.user; // getting user this way is not reliable for admin UI
    const refreshToken = await getTokenFromRequest(req,REFRESHTOKEN) as string

    if (!refreshToken) {
        return undefined
      }
       // =========================================================
      //try catch will catch error from jwt.verify and returned appropriate value
      // =========================================================
      try{
        const decoded = jwt.verify(refreshToken,payload.secret,{ignoreExpiration: true} ) as jwt.JwtPayload
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
        if(!userFromToken) throw new Error("No user found")

         return userFromToken as TypedUser

      }catch(error){
       
        return undefined

      }
         
    }  
//=================================================
// End of get user from request
//==================================================
      
// -------------------------------------------------------------------
// 4. Locate afterLogout hooks function (Payload v3 requires manual execution)
// -------------------------------------------------------------------
 
    const callAfterLogin = async(payload:PayloadRequest['payload'],userForHooks:TypedUser) => {
       
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

      for (const hook of afterLogoutHooks) {
        try {
          if (typeof hook === "function") {
            await hook({ user: userForHooks, req });
          }
        } catch (hookError) {

          // Hooks must never break logout flow
        }
      }     
}
//================================================
  //End of call afterLogout hook function
//================================================  

    const user =  await getUserFromReq(req) // this will get user from refresh-token
   
    let tokenId:string
   if(user != undefined || user != null) {
    //make sure user exist, either as req.user or from refresh-token
    req.user = user

    const tokenFromDb = await req.payload.find({
      collection: 'refresh-token',
      where:{
        user:{
          equals: user.id
        }
      },
      limit:1
    })
    // Token id from database for the present logged in user
    tokenId = tokenFromDb.docs[0]?.tokenId as string
   }  

  //===============================================================
  // Perform logout and after logout hook
  //================================================================
  let logout:string
  if( tokenId != undefined){  
   logout = await deleteRefreshTokenId(req.payload,tokenId) //log user out 
  }
  //message and status base on if logout was successful or not
  const loggedOut = logout === "success" ? {message:"Logged out successful",status:200}:
                    {message:"Still logged out", status:200}
  // if logout is ok, now call after logout
  //logout === "success" &&  await callAfterLogin(req.payload,user) // call after logout   
  await callAfterLogin(req.payload,user) // call after after logout hook regardless
 req.user = null

       // -------------------------------------------------------------------
      // 3. Prepare and clear relevant cookies in header to be returned
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
      // 6. Return success response
      // -------------------------------------------------------------------
      return new Response(
        JSON.stringify({ message: loggedOut.message,}),
        { status: loggedOut.status, headers }
      );
  },
};
