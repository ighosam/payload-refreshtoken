import type { CollectionAfterLoginHook, CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid'
import type { PluginOptions } from '../types.js'
import {generateRefreshToken} from '../utilities/generateToken.js'
import { isRefreshTokenValid } from '../utilities/isRefreshTokenValid.js'
import {parseRequestBody} from '../utilities/myParsedReqBody.js'


//export const createAfterLogin = (options:PluginOptions):CollectionAfterLoginHook =>{

  export const afterLogin:CollectionAfterLoginHook = async ({req,user})=>{

  
    
const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 60 * 100)

       /* 
        let foundToken:string
        try{   
       const token = await generateRefreshToken(req.payload,userArg,options)
      
       if(!token) throw new Error("Can't generate refreshToken")
       foundToken = token
  

        }catch(error){
            //maybe call logout and send user back to login
            //return user to login again.
            throw new Error("Login error, try agian")
        }    
     */

  return user 

}


