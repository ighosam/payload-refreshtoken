import {type PayloadRequest } from "payload";
import jwt from 'jsonwebtoken'
import {parse as parseCookies } from 'cookie'
import {BodyParseError, parseJsonBody} from './parseJsonBody.js'

type getTokenIdResponse =  {
    tokenId?:string,
    error?:string
}

export const getRefreshTokenId = async (req:PayloadRequest) =>{

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
        return {
            error: "refreshToken is required",
            status: 500
        }
    }  
    
    const secret = process.env.PAYLOAD_SECRET
            if (!secret) {
              return {
                     error: "Server configuration error" ,
                    status:500
                }
                

            }
    
           
           
            let decodedToken: any;
            try {
              decodedToken = jwt.verify(refToken, secret);
              
            } catch (error) {
              return { 
                     error: "Invalid or expired refresh token",
                     status: 500
                    }
               
             
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

          //console.log("FoundId is: ",foundToken)
          
       //if token id is not available in refresh-token collection, return an error.   
            if (!foundToken) {
              //invalid refresh token
                return { 
                    error: "invalid refresh token",
                    status:500
                 }
                               
              }
        
      // check if token from refreshToken has expired.
        // The 'exp' claim is a Unix timestamp (in seconds).
          const currentTime = Date.now() / 1000; // Convert to seconds
      
            if(exp < currentTime){
              return {
                error: "RefreshToken is expired",
                status:500
              }
               //redirect users to login
            }

            //if the token exist and it is valid now return only token.
            return{
                tokenId:tokenId,
                status:200
            }
      

}