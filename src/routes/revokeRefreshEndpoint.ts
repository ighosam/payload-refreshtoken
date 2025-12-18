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
        
    if(!updateTokenId)
     throw new Error('Revoke refresh token failed')

   }catch(error){ 
   return Response.json({Message: 'Revoke refresh token failed'},{status:401})

   }
   return Response.json({message:"Success refresh token revoked"},{status:200})
    }
  }