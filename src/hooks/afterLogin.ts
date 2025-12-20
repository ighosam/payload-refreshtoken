import type { CollectionAfterLoginHook, CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid'
import type { PluginOptions } from '../types'
import {generateRefreshToken} from '../utilities/generateToken'
import { isRefreshTokenValid } from '../utilities/isRefreshTokenValid'
import {parseRequestBody} from '../utilities/myParsedReqBody'


//export const createAfterLogin = (options:PluginOptions):CollectionAfterLoginHook =>{

  export const afterLogin:CollectionAfterLoginHook = async ({user,token})=>{

  

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

        console.log("YOU ARE NOW LOGGED IN, THANK YOU")
    

  return user 

}


