import jwt from 'jsonwebtoken'
import type { PayloadRequest } from 'payload'

export async function isTokenExpired(req:PayloadRequest,token: string): Promise<boolean> {
const { TokenExpiredError } = jwt
  try {
        const secret = req.payload.secret
        if (!secret||secret === '') throw new Error("Invalid secret") 
             
    const decoded = jwt.verify(token,secret ) as jwt.JwtPayload

    // If verify() passes, token is valid and not expired
    
    return false
  
  } catch (err: any) {
 
    //if (err.name === 'TokenExpiredError') return true
   if (err instanceof TokenExpiredError || err.message.includes('expired')) {
  // Handle token expiry
  
  return true
}
   
    // Other errors (invalid signature, malformed token)
    return false
  }
}
