import type { CollectionAfterLogoutHook,PayloadRequest} from "payload";
import {deleteRefreshTokenId} from '../utilities/deleteRefreshTokenId.js'
import { getTokenFromRequest } from "../utilities/getTokenFromRequest.js";
import jwt from 'jsonwebtoken'
import { tokenNames } from "../utilities/tokenNames.js";

export const afterLogout:CollectionAfterLogoutHook = async ({req})=>{
  const {REFRESHTOKEN} = tokenNames()

  //const accessToken = await getTokenFromRequest(req,'payload-token')
  const refreshToken = await getTokenFromRequest(req,REFRESHTOKEN) as string 
  const secret = req.payload.secret
  const decoded = jwt.verify(refreshToken,secret ) as jwt.JwtPayload
      const {tokenId,collection,sid,userId} = decoded

      const user = await req.payload.find({
        collection:'users',
        where:{
          id:{
            equals:userId
          }
          
        },
        limit: 1,
      })
//console.log("I found a user he is: ",user.docs[0])

  const deleted =   await deleteRefreshTokenId(req.payload,tokenId)
  // console.log("YEAH YOU LOGGED OUT!!!!!: ",deleted) // Call your logout endpoint to clear HttpOnly cookies
          
return 'success'

}