// endpoints/login.ts
import {type Endpoint, type PayloadRequest } from "payload";
//import { Response } from 'express';
import type { CollectionAfterLoginHook } from 'payload';
import {BodyParseError, parseJsonBody} from './utilities/parseJsonBody.js'
import type { PluginOptions } from './types.js';
import {generateRefreshToken } from './utilities/generateToken.js'


type Authtype = {
    email:string,
    password:string
}

export const createLogin = (options:PluginOptions)=>{
 const loginEndpoint:Endpoint = {
  path: "/login",
  method: "post",
  handler: async (req: PayloadRequest) => {

    console.log("I AM USING THIS LOGIN!!!!!!")
     const data = await parseJsonBody<Authtype>(req)
  
     const { email, password } = data;
    try {
      const { user, token } = await req.payload.login({
        collection: 'users',
        data: { email, password },
        req,
      });
const refreshToken = await generateRefreshToken(req,options)      

const cookieValue = [
  `refreshToken= ${refreshToken}`, // Key=Value
  `Path=/`,              // Accessible across all paths
  `SameSite=None`,       // Required for cross-site usage
  `Secure`,              // Required with SameSite=None (HTTPS only)
  `HttpOnly`,            // Recommended for security (blocks JS access)
  `Max-Age=86400`,       // Expires in 1 day (in seconds)
].join('; ');

const userPrefsCookie = [
  `payload-token=${token}`, // URL-encoded value
  `Path=/`,
  `SameSite=Strict`,    // Strict for sensitive actions
  `Secure`,
  `httpOnly`,
  `Max-Age=2592000`,    // Expires in 30 days
  // Omitting HttpOnly to allow JS access (if needed)
].join('; ');

  return Response.json(
      {
        "payload-token":token, //return payload-token, optional
        "refreshToken":refreshToken, //return refreshToken, optional
        user:{
           id: user.id,
           email:user.email
        }
      },{
      status:200,
      headers:{
        'content-type':'application/json',
        'set-cookie': [cookieValue,userPrefsCookie] as unknown as string // [cookieValue] if multiple cookies
      }
    })
      // Return access token in response (can also be set as cookie if needed)
    } catch (error) {
      return Response.json({ error: 'Invalid credentials' },{status:401});
    }
  },

}
return loginEndpoint
}


