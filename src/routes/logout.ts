// endpoints/logout.ts
import type { Endpoint } from "payload";
import { tokenNames } from "../utilities/tokenNames";
import { deleteRefreshTokenId } from "../utilities/deleteRefreshTokenId";
import { runAfterLogoutHooks } from "../utilities/runAfterLogout";
import { getUserFromReq } from "../utilities/getUserFromRequest";

const {PAYLOADTOKEN,REFRESHTOKEN} = tokenNames()
export const logoutEndpoint: Endpoint = {
  path: "/logout",
  method: "post",
  handler: async (req) => { 

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
  // if the user have valid refresh tokenId, he is able to get new access token
  // therefore if there is no valid refresh tokenId the user is not logged in

  let logout:string
  if( tokenId != undefined){  
   logout = await deleteRefreshTokenId(req.payload,tokenId) //log user out 
  }
  //message and status base on if logout was successful or not
  const loggedOut = logout === "success" ? {message:"Logged out successful",status:200}:
                    {message:"Still logged out", status:200}
  // if logout is ok, now call after logout
  //logout === "success" &&  await callAfterLogin(req.payload,user) // call after logout   
  //await callAfterLogin(req.payload,user) // call after after logout hook regardless
  await runAfterLogoutHooks({req,collectionSlug:'users'})

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
