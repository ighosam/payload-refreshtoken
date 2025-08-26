
import {type Endpoint, type PayloadRequest } from "payload";
import jwt from 'jsonwebtoken'
import {parse as parseCookies } from 'cookie'
import type { PluginOptions } from './types.js'
import {parseJsonBody} from './utilities/parseJsonBody.js'

interface YourRequestBody {
  // Define your request body structure
  title: string;
  content: string;
  // ... other fields
}


export const createRefreshEndpoint = (options:PluginOptions)=>{

  const refreshEndpoint:Endpoint = {
    path: "/mytoken",
    method: "post",
    handler:  async(req:PayloadRequest)=>{

      interface rtoken {
        refreshToken?:string,
      }

      let body = await parseJsonBody(req) as rtoken

      console.log("THIS IS THE RESULT: ",body.refreshToken)

      const refreshToken = body.refreshToken

const rawCookieHeader = req.headers.get('cookie')

const cookies = parseCookies(rawCookieHeader || '')

const token = cookies['payload-token'] // or whatever cookie name you expect

//Now you can verify or decode the JWT, or use it further

//refresh token or read it from httponly cookie

const data = req?.body
//const cookies = (req as PayloadRequest &{cookies:Record<string,string>}).cookies
const {user} = req

const secret = process.env.PAYLOAD_SECRET

console.log(secret)


   //const cookie = req.headers.getSetCookie()


 

  //if(!req.user) return Response.json({message:"this is crazy"},{status:401})

//2 check database if token id exist and compare the tokenId


//3 generate refreshtoken.
const cookieValue = [
  `maytoken=asdfasdfsda`, // Key=Value
  `Path=/`,              // Accessible across all paths
  `SameSite=None`,       // Required for cross-site usage
  `Secure`,              // Required with SameSite=None (HTTPS only)
  `HttpOnly`,            // Recommended for security (blocks JS access)
  `Max-Age=86400`,       // Expires in 1 day (in seconds)
].join('; ');

const userPrefsCookie = [
  `user_prefs=dark_mode%2Cnotifications`, // URL-encoded value
  `Path=/`,
  `SameSite=Strict`,    // Strict for sensitive actions
  `Secure`,
  `Max-Age=2592000`,    // Expires in 30 days
  // Omitting HttpOnly to allow JS access (if needed)
].join('; ');

    return Response.json({message:"you got it"},{
      status:200,
      headers:{
        'content-type':'application/json',
        'set-cookie': [cookieValue,userPrefsCookie] as unknown as string // [cookieValue] if multiple cookies
      }
    })




/////////////////////////////


    ///////////////////////
    return Response.json({message: "asdfasdf"})
    }


  }

return refreshEndpoint
}


/////////////////////////////////////
