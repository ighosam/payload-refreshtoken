
import {type Endpoint, type PayloadRequest } from "payload";
import jwt from 'jsonwebtoken'
import {parse as parseCookies } from 'cookie'
import type { PluginOptions } from './types.js'
import {BodyParseError, parseJsonBody} from './utilities/parseJsonBody.js'
import {generateAccessToken,generateRefreshToken } from './utilities/generateToken.js'
import { getRefreshTokenId } from "./utilities/getRefreshTokenId.js";

interface YourRequestBody {
  // Define your request body structure
  title: string;
  content: string;
  // ... other fields
}
interface TokenId {
  tokenId: string
}
export const createRefreshEndpoint = (options:PluginOptions)=>{

  const refreshEndpoint:Endpoint = {
    path: "/mytoken",
    method: "post",
    handler:  async(req:PayloadRequest)=>{

     // if we can find a valid refreshTokenId for this user
     // it means that the user is still logged in or valid user exist
     const tokenId = await getRefreshTokenId(req)
  if(tokenId.status!== 200){
    return Response.json({
      error:"No valid user found"
    },{status:500}
  )
  }
  //once we get here, it means there is a valid user
  //console.log("TOKEN ID IS : ",tokenId.tokenId) 

//if we get here, now we can generate new refresh token and new access token.
//genereates refreshToken
const refreshToken = await generateRefreshToken(req,options)
const accessToken = await generateAccessToken(req,options)

//set generated tokens to http only
const cookieValue = [
  `refreshToken= ${refreshToken}`, // Key=Value
  `Path=/`,              // Accessible across all paths
  `SameSite=None`,       // Required for cross-site usage
  `Secure`,              // Required with SameSite=None (HTTPS only)
  `HttpOnly`,            // Recommended for security (blocks JS access)
  `Max-Age=86400`,       // Expires in 1 day (in seconds)
].join('; ');

const userPrefsCookie = [
  `payload-token=${accessToken}`, // URL-encoded value
  `Path=/`,
  `SameSite=Strict`,    // Strict for sensitive actions
  `Secure`,
  `Max-Age=2592000`,    // Expires in 30 days
  // Omitting HttpOnly to allow JS access (if needed)
].join('; ');

    return Response.json(
      {
        "payload-token":accessToken, //return payload-token, optional
        "refreshToken":refreshToken //return refreshToken, optional
      },{
      status:200,
      headers:{
        'content-type':'application/json',
        'set-cookie': [cookieValue,userPrefsCookie] as unknown as string // [cookieValue] if multiple cookies
      }
    })

 }


  }

return refreshEndpoint
}

