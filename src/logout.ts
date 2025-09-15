
// endpoints/login.ts
import {type Endpoint, type PayloadRequest } from "payload";
//import { Response } from 'express';
import { parseJsonBody} from './utilities/parseJsonBody.js'
import type { PluginOptions } from './types.js';
import {deleteRefreshTokenId} from './utilities/deleteRefreshTokenId.js'
import {parse as parseCookies } from 'cookie'
import { getRefreshTokenId } from "./utilities/getRefreshTokenId.js";


type Authtype = {
    email:string,
    password:string
}

export const createLogout = (options:PluginOptions)=>{

 const logoutEndpoint:Endpoint = {
  path: "/logout",
  method: "post",
  handler: async (req: PayloadRequest) => {
     
const cookieValue = [
  `refreshToken=asdfasdfsd`, // Key=Value
  `Path=/`,              // Accessible across all paths
  `SameSite=None`,       // Required for cross-site usage
  `Secure`,              // Required with SameSite=None (HTTPS only)
  `HttpOnly`,            // Recommended for security (blocks JS access)
  `Max-Age=0`,       // Expires in 1 day (in seconds)
  `Expires=Thu, 01 Jan 1970 00:00:00 GMT`
].join('; ');

const userPrefsCookie = [
  `payload-token=asdfsadfsd`, // URL-encoded value
  `Path=/`,
  `SameSite=Strict`,    // Strict for sensitive actions
  `Secure`,
  `httpOnly`,
  `Max-Age=0`,    // Expires in 30 days
  `Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  // Omitting HttpOnly to allow JS access (if needed)
].join('; ');

///////////////////////////////////
//This block of code is not needed
const rawCookieHeader = req.headers.get('cookie')
const cookies = parseCookies(rawCookieHeader || '')
const headerToken = cookies['refreshToken']
const token = cookies['payload-token']
//////////////////////////////////

  // if we can find a valid refreshTokenId for this user
  // it means that the user is still logged in or valid user exist
   const tokenId = await getRefreshTokenId(req)
  if(tokenId.status!== 200){
    return Response.json({
      error:"No valid user found"
    },{status:500}
  )
  }
const deleted = await deleteRefreshTokenId(req) 
req.user = null; 
///////////////////////////////////


 return Response.json(
      {
       message: 'Logged out successfully' 
      },{
      status:200,
      headers:{
        'content-type':'application/json',
        'set-cookie': [userPrefsCookie,cookieValue] as unknown as string, // [cookieValue] if multiple cookies
       
      }
    }) 



 

/*
const newResponse = new Headers(response.body)

*/

  },

}
return logoutEndpoint
}
//////////////////


///////////////////

