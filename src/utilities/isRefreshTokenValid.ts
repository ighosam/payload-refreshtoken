import jwt from 'jsonwebtoken'
import { type Payload, type PayloadRequest } from 'payload';

export const isRefreshTokenValid = (req:PayloadRequest,token: string):boolean =>{

     try {
        const secret = req.payload.secret
        if (!secret||secret === '') throw new Error("Invalid secret") 
       
   const decoded = jwt.verify(token,secret ) as jwt.JwtPayload

  } catch (error: any) {
    // Any error means that this token is not valid
   return false
  }
  return true
}
