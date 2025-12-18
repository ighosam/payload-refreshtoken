import { type Endpoint, type PayloadRequest } from "payload";
import { generateAccessToken, generateRefreshToken } from "../utilities/generateToken";
import { getTokenFromRequest } from "../utilities/getTokenFromRequest";
import { isRefreshTokenValid } from "../utilities/isRefreshTokenValid";
import { tokenNames } from "../utilities/tokenNames";
import type {TypedUser} from 'payload'
import { refreshTokenIdMatched } from "../utilities/refreshTokenIdMatched";
 import { v4 as uuidv4 } from 'uuid'

import jwt, {
  TokenExpiredError,
  JsonWebTokenError,
 // NotBeforeError,
} from 'jsonwebtoken'

  export const refreshEndpoint: Endpoint = {
    path: "/refresh-token",
    method: "post",            
    handler: async (req: PayloadRequest) => {

      const {PAYLOADTOKEN,REFRESHTOKEN} = tokenNames()
      //  Extract refresh token from request (cookie, body, or header)
      const reqRefreshToken = await getTokenFromRequest(req, REFRESHTOKEN);
      const  headers = new Headers();

      
       try{

      if (!reqRefreshToken) 
        throw new Error("Refresh token is required")
     /*   
      //  Validate refresh token
      const refreshTokenIsValid = isRefreshTokenValid(req, reqRefreshToken);
     
      if (!refreshTokenIsValid)
        throw new Error("Invalid or expired refresh token")
    */    
      //if we get here it means the refrsh token is valid
      // ====================================================

      const decoded = jwt.verify(reqRefreshToken,req.payload.secret ) as jwt.JwtPayload
      const {userId,sid,tokenId} = decoded
    //=========================================================
    // Check to make sure that the tokenId from refreshToken matched that of db
         if(tokenId === undefined || !tokenId)
            throw new Error("Invalid token cannot refresh")

         // first make sure that this user is logged in
         // by checking for tokenId in refresh-token collection for this user
         //===================================================================

 const tokenIdExist = await req.payload.find({
        collection:'refresh-token',
        where:{
         user: {
            equals:userId
         }  
        },
        limit: 1
    }) 

    if(!(tokenIdExist.docs.length > 0)) throw new Error("This user is not logged in")

     //if the user is logged in, now check for if the token matched
      const tokenIdMatched = await refreshTokenIdMatched(req,tokenId)
        if(!tokenIdMatched){
          //revoke the tokenId for this user
         const NewtokenId = uuidv4()
          await req.payload.update({
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
          throw new Error("token is compromised, revoked token")
          }
    

      //get user from db by user id stored in refresh-token
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
      // Prepare user info for new token generation
      // if req.user is undefined, get user from user db by user id
      if(!req.user || req.user === null){ req.user = user as TypedUser}

      if (!user?.id || !user?.email) {
        throw new Error("User not found or invalid request context")
       
      }
      
      // 4. Generate new tokens
      const refreshToken = await generateRefreshToken(req,sid) as string;
      const accessToken = await generateAccessToken(req,sid) as string;

      const NewaccessDecoded = jwt.verify(accessToken,req.payload.secret) as jwt.JwtPayload
      const payExp = NewaccessDecoded.exp

        //===========================================
        //if no error, refresh the token.
        //============================================
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

    }catch(error){
       //when payload-token expires it will trigger logout for admin UI
       //admin UI trigers refresh just before payload-token expires
       // so by stting payload-token to expire when refresh expires will trigger
       //logout for admin UI (trick provided by Osam)
        headers.append(
        'set-cookie',
        `${PAYLOADTOKEN}=; HttpOnly; Path=/; SameSite=Lax; Secure; Max-Age=0`
        ); 
         
         return Response.json(
          { error: error.message },
          { status: 403,headers })
        
       }

    },
  };

