import { type Endpoint, type PayloadRequest } from "payload";
import { generateAccessToken, generateRefreshToken } from "../utilities/generateToken";
import { getTokenFromRequest } from "../utilities/getTokenFromRequest";
import { isRefreshTokenValid } from "../utilities/isRefreshTokenValid";
import { tokenNames } from "../utilities/tokenNames";
import type {TypedUser} from 'payload'
import jwt from 'jsonwebtoken'
import { deleteRefreshTokenId } from "../utilities/deleteRefreshTokenId";
import { refreshTokenIdMatched } from "../utilities/refreshTokenIdMatched";


  export const refreshEndpoint: Endpoint = {
    path: "/refresh-token",
    method: "post",            
    handler: async (req: PayloadRequest) => {
      const {PAYLOADTOKEN,REFRESHTOKEN} = tokenNames()
      // 1. Extract refresh token from request (cookie, body, or header)
      const reqRefreshToken = await getTokenFromRequest(req, REFRESHTOKEN);

      if (!reqRefreshToken) {
        return Response.json(
          { error: "Refresh token is required" },
          { status: 401 }
        );
      }
      
      // 2. Validate refresh token
      const refreshTokenIsValid = isRefreshTokenValid(req, reqRefreshToken);
     
      if (!refreshTokenIsValid) {
        return Response.json(
          { error: "Invalid or expired refresh token" },
          { status: 401 }
        );
      }
     
      //if we get here it means the refrsh token is valid
      // ====================================================

      const decoded = jwt.verify(reqRefreshToken,req.payload.secret ) as jwt.JwtPayload
      const {userId,sid,tokenId} = decoded
    //=========================================================
    // Check to make sure that the tokenId from refreshToken matched that of db
         if(tokenId === undefined || !tokenId){
               return Response.json(
          { error: "Invalid or expired refresh token" },
          { status: 401 }
        );
          }
     
      const tokenIdMatched = await refreshTokenIdMatched(req,tokenId)

        if(!tokenIdMatched){
         //delete the refresh token id in Db
          deleteRefreshTokenId(req.payload,reqRefreshToken)
          return Response.json(
          { error: "Suspected man in the middle" },
          { status: 409 }
        );
          }
    
      const userResult = await req.payload.find({
        collection:'users',
        where:{
          id:{
            equals:userId
          }
        },
        limit:1
      })
      const userResopons = userResult.docs[0]
      const user = userResopons ? userResopons : req.user
      // 3. Prepare user info for new token generation
      if(!req.user || req.user === null){ req.user = user as TypedUser}

      if (!user?.id || !user?.email) {
        return Response.json(
          { error: "User not found or invalid request context" },
          { status: 401 }
        );
      }
      
      // 4. Generate new tokens
      const refreshToken = await generateRefreshToken(req,sid) as string;
      const accessToken = await generateAccessToken(req,sid) as string;

      const NewaccessDecoded = jwt.verify(accessToken,req.payload.secret) as jwt.JwtPayload
      const payExp = NewaccessDecoded.exp
   ////////////////////////////////////////////////////////
 const headers = new Headers();
              
               headers.append(
                'set-cookie',
                `${REFRESHTOKEN}=${refreshToken}; HttpOnly; Path=/; SameSite=Lax; Secure`
            );
            
            headers.append(
                'set-cookie',
                `${PAYLOADTOKEN}=${accessToken}; HttpOnly; Path=/; SameSite=Lax; Secure`
            ); 
            
      // 6. Return response
      return Response.json(
         
          { user, 
            [PAYLOADTOKEN]:accessToken,
           [REFRESHTOKEN]:refreshToken,
           exp:payExp
         },
          {status: 200, headers}
      );
    },
  };

