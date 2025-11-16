import {type Endpoint, type PayloadRequest,type Payload } from "payload";
import type { PluginOptions } from './types.js';
import {generateRefreshToken } from './utilities/generateToken.js'
import { parseRequestBody } from "./utilities/myParsedReqBody.js";
import jwt from 'jsonwebtoken'

type Authtype = {
    email:string,
    password:string
}

//export const createLogin = (options:PluginOptions)=>{
 export const loginEndpoint:Endpoint = {
  path: "/login",
  method: "post",
  handler: async (req: PayloadRequest) => {
/////////////////////////////////
const { TokenExpiredError } = jwt
/////////////////////////////////

 const data = await parseRequestBody(req)
     const { email, password } = data;
     //const collection = req.user?.collection
     if(!email) throw new Error("I can't find this email")
    try {
      const { user, token,exp } = await req.payload.login({
        collection:"users",
        data: { email, password },
        req,
      });

      const userArg = {
        id:user.id as number,
        email: user.email as string,
        collection: "user"
      }

     console.log("myOptions is: ",req.payload.config.custom.refreshOptions) 
//////////////////////
//const decoded = jwt.decode(token!, { complete: true })
//console.log("This is the decoded",decoded)
///////////////////////

//const refreshToken = await generateRefreshToken(req) as string
const refreshToken = await generateRefreshToken(req) as string

console.log('my refreshToken is: ',refreshToken)

const headers = new Headers()
headers.append(`set-cookie`, `refreshToken=${refreshToken}; HttpOnly; Path=/; SameSite=Lax; Secure`)
headers.append(`set-cookie`, `payload-token=${token}; HttpOnly; Path=/; SameSite=Lax; Secure`)


return Response.json( 
    { user, token,refreshToken, exp },
    { status: 200, headers },  
)
      // Return access token in response (can also be set as cookie if needed)
    } catch (error) {
      return Response.json({ error: 'Invalid credentials' },{status:405});
    }
}

}



