import type { CollectionAfterLoginHook } from 'payload'
import { v4 as uuidv4 } from 'uuid'
import type { PluginOptions } from '../types.js'
import {generateRefreshToken} from '../utilities/generateToken.js'

export const createAfterLogin = (options:PluginOptions):CollectionAfterLoginHook =>{

  const afterLogin:CollectionAfterLoginHook = async ({req,user})=>{
  
        try{  
       const token = await generateRefreshToken(req,options)

       console.log("WE FOUND THE TOKEN: ",token)

       if(!token) throw new Error("Can't generate refreshToken")

       user = {
        ...user,
       refreshToken:token
       }
                  // Create refresh token document
                  /*
                  await req.payload.create({
                    collection: 'refresh-token',
                    data: {
                      tokenId: token?.tokenId,
                      user: user.id,
                    },
                  })

                  */

        }catch(error){
            console.log("Message: ",error)
            //return user to login again.
        }

                
  return user
}

return afterLogin

}
