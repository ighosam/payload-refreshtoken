
import {type Endpoint, type PayloadRequest } from "payload";
import jwt from 'jsonwebtoken'
import {parse as parseCookies } from 'cookie'
import type { PluginOptions } from './types.js'
import {BodyParseError, parseJsonBody} from './utilities/parseJsonBody.js'
import {generateAccessToken,generateRefreshToken } from './utilities/generateToken.js'

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

      //function to get cookies from request body if it exist
      const getBodyCookies = async (req:PayloadRequest)=>{
             try{
         const data = await parseJsonBody<rtoken>(req)
         const refreshToken = data.refreshToken
         return refreshToken
        //if there is an error getting cookies from request body, return null
      }catch(error){
        if(error instanceof BodyParseError){
          //return Response.json({error: error.message},{status:400})
          return undefined
        }
        //throw error
        return undefined
      }

      }


const bodyToken = await getBodyCookies(req);
const rawCookieHeader = req.headers.get('cookie')
const cookies = parseCookies(rawCookieHeader || '')
const headerToken = cookies['refreshToken'] // or whatever cookie name you expect

const refToken = headerToken ? headerToken : bodyToken

//if refresh token is not available then returned an error message.
 if(!refToken){
    return Response.json({Message: "refreshToken is required"},{status:500})
   }

const secret = process.env.PAYLOAD_SECRET
        if (!secret) {
          console.error('PAYLOAD_SECRET environment variable is not set');
          return Response.json(
            { error: "Server configuration error" },
            { status: 500 }
          );
        }

       
       
        let decodedToken: any;
        try {
          decodedToken = jwt.verify(refToken, secret);
          
        } catch (error) {
          console.log("THE REAL ERROR IS: ",error)
          return Response.json(
            { error: "Invalid or expired refresh token" },
            { status: 401 }
          );
        }
   //get tokenId, collection,id,iat and exp from decodedToken
  const {tokenId,collection,id,iat,exp} = decodedToken
  //get payload instance from req.
  

//check to see if this token is valid and can be found in refresh-token collection
  const  payloadTokenId = await req.payload.find({
    collection: 'refresh-token',
    where:{
      tokenId:{
        equals: tokenId
      }
    }
    })

    const foundToken = await payloadTokenId.docs[0]?.tokenId
    
 //if token id is not available in refresh-token collection, return an error.   
      if (!foundToken) {
        //invalid refresh token
          return Response.json(
            { error: "invalid refresh token" },
            { status: 500 }
          );
        }
  
// check if token from refreshToken has expired.
  // The 'exp' claim is a Unix timestamp (in seconds).
    const currentTime = Date.now() / 1000; // Convert to seconds

      if(exp < currentTime){
        return Response.json({Message: "RefreshToken is expired"},{status:500})
         //redirect users to login
      }

//if we get here, now we can generate new refresh token and new access token.
//genereates refreshToken
const refreshToken = await generateRefreshToken(req,options)
const accessToken = await generateAccessToken(req,options)

//generate refreshtoken.
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
        "payload-token":accessToken,
        "refreshToken":refreshToken
      },{
      status:200,
      headers:{
        'content-type':'application/json',
        'set-cookie': [cookieValue,userPrefsCookie] as unknown as string // [cookieValue] if multiple cookies
      }
    })

/////////////////////////////
/////////////////////////

 }


  }

return refreshEndpoint
}


/////////////////////////////////////
