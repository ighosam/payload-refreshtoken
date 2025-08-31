import type { CollectionAfterLoginHook } from 'payload'
import { v4 as uuidv4 } from 'uuid'
import type { PluginOptions } from '../types.js'
import {generateRefreshToken} from '../utilities/generateToken.js'

export const createAfterLogin = (options:PluginOptions):CollectionAfterLoginHook =>{

  const afterLogin:CollectionAfterLoginHook = async ({req,user})=>{
  
        try{  
                //generate refresh token

                const tokenId = uuidv4()
                const {payload} = req

     //delete any previous token id for this user if it exist
       const delete_tokenId =  await req.payload.delete({
        collection:'refresh-token',
        where:{
         user: user.id
        } 
       })

       const token = generateRefreshToken(req)

       user = {
        ...user,
       refreshToken:token
       }

                  // Create refresh token document
                  await req.payload.create({
                    collection: 'refresh-token',
                    data: {
                      tokenId: uuidv4(),
                      user: user.id,
                    },
                  })

        }catch(error){
            console.log("Message: ",error)
        }

                
  return user
}

return afterLogin

}
