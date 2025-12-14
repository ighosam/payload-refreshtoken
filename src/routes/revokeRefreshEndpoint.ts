 import { type Endpoint, type PayloadRequest } from "payload"; 
 import { getTokenFromRequest } from "../utilities/getTokenFromRequest"
 import { tokenNames } from "../utilities/tokenNames";
 import { deleteRefreshTokenId } from "../utilities/deleteRefreshTokenId";
  import jwt from 'jsonwebtoken'

  export const revokeRefreshEndpoint: Endpoint = {
    path: "/revoke-token",
    method: "post",            
    handler: async (req: PayloadRequest) => {
    const {REFRESHTOKEN} = tokenNames()

        //get token from request
  const refreshToken = await getTokenFromRequest(req,REFRESHTOKEN) as string
if(!refreshToken){
 return Response.json({message:'refresh token must be provided'},{status:401}) 
}


        //is refresh token valid
const decoded = jwt.verify(refreshToken,req.payload.secret ) as jwt.JwtPayload
const {tokenId} = decoded



   if(!tokenId){
    return Response.json({message:'Invalid refresh token'},{status:401})
   }

   try{
    const deleted = await deleteRefreshTokenId(req.payload,tokenId)
        
    if(deleted != 'success' )
     throw new Error('Revoke refresh token failed')

   }catch(error){ 
   return Response.json({Message: 'Revoke refresh token failed'},{status:401})

   }
   return Response.json({message:"Success refresh token revoked"},{status:200})
    }
  }