import type { CollectionAfterLoginHook } from 'payload'
import { v4 as uuidv4 } from 'uuid'
import type { PluginOptions } from '../types.js'

export const createAfterLogin = (options:PluginOptions):CollectionAfterLoginHook =>{

  const afterLogin:CollectionAfterLoginHook = async ({req,user})=>{
  
        try{
                
                //generate refresh token

                const tokenId = uuidv4()
                const {payload} = req

     //delete any previous token id for this user
       const delete_tokenId =  await req.payload.delete({
        collection:'refresh-token',
        where:{
         user: user.id
        } 
       })

       console.log("user.id is: ",user.id)

      //const token = 


       user = {
        ...user,
        myName:'my name is Osam'
       }

       
       if(delete_tokenId.docs.length > 0){
        console.log("I DELETED INITIAL DATA: ",delete_tokenId)
       }else{
        console.log("NOTHING TO DELETE: ",delete_tokenId)
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
