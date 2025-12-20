 import { type Endpoint, type PayloadRequest } from "payload"; 
 import { getTokenFromRequest } from "../utilities/getTokenFromRequest"
 import { tokenNames } from "../utilities/tokenNames";
 import jwt from 'jsonwebtoken'
 import { v4 as uuidv4 } from 'uuid'

  export const revokeRefreshEndpoint: Endpoint = { 
    path: "/revoke-token",
    method: "post",            
    handler: async (req: PayloadRequest) => {

    const {REFRESHTOKEN} = tokenNames()
        //get token from request
  const refreshToken = await getTokenFromRequest(req,REFRESHTOKEN) as string
  const NewtokenId = uuidv4()

  //only revoke if the user is currently logged in
  // and the token to be revoked is not expired.


  
  try{
        if(!refreshToken) throw new Error('refresh token must be provided') 
        
        //if refresh token is invalid, below line will throw an error
        const decoded = jwt.verify(refreshToken,req.payload.secret ) as jwt.JwtPayload
        const {userId} = decoded

        //update the refresh-token id, now the
        //user of this refresh-token can no longer refresh
        //when try to refresh 401 code will be returned
        const updateTokenId = await req.payload.update({
            collection:"refresh-token",
            data:{
               tokenId: NewtokenId,  
            },
            where:{
                user:{
                    equals:userId //udate for refresh-token user
                }
            }
        })
         // ===============================================================================
        // No data will exist for this user in refresh-token if this user is not logged in
        // update will not work.
        // =================================================================================
        if(!(updateTokenId.docs.length>0)) throw new Error("This user is not logged in")

   }catch(error){ 
    console.log("Revoke token failed: ",error.message)
    //return success response for security reasons.
    return Response.json({Message: `Success, token revoked`},{status:200})

   }
   return Response.json({message:"Success, token revoked"},{status:200})
    }
  }