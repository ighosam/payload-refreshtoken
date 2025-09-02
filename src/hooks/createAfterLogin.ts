import type { CollectionAfterLoginHook } from 'payload'
import { v4 as uuidv4 } from 'uuid'
import type { PluginOptions } from '../types.js'
import {generateRefreshToken} from '../utilities/generateToken.js'

export const createAfterLogin = (options:PluginOptions):CollectionAfterLoginHook =>{

  const afterLogin:CollectionAfterLoginHook = async ({req,user})=>{
  
        try{ 
          
       const token = await generateRefreshToken(req,options)

       if(!token) throw new Error("Can't generate refreshToken")

       user = {
        ...user,
       refreshToken:token
       }

        }catch(error){
            //maybe call logout and send user back to login
            //return user to login again.
            throw new Error("Login error, try agian")
        }

                
  return user
}

return afterLogin

}
