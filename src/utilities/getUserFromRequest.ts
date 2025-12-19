import type { PayloadRequest,TypedUser } from "payload"
import { getTokenFromRequest } from "./getTokenFromRequest"
import { tokenNames } from "./tokenNames"
import jwt from 'jsonwebtoken'

export const getUserFromReq = async (req:PayloadRequest) =>{
      if(req.user != undefined || req.user != null) return req.user 
      const {REFRESHTOKEN}  = tokenNames()    
      //const user = req.user; // getting user this way is not reliable for admin UI
    const refreshToken = await getTokenFromRequest(req,REFRESHTOKEN) as string

    if (!refreshToken) {
        return undefined
      }
       // =========================================================
      //try catch will catch error from jwt.verify and returned appropriate value
      // =========================================================
      try{
        const decoded = jwt.verify(refreshToken,req.payload.secret,{ignoreExpiration: true} ) as jwt.JwtPayload
        const {userId} = decoded
         const findUser = await req.payload.find({
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