import type { CollectionAfterLoginHook } from 'payload'
import { v4 as uuidv4 } from 'uuid'

export const afterLogin:CollectionAfterLoginHook = async ({req,user})=>{
 
        try{
                
                //generate refresh token

                const tokenId = uuidv4()
                const {payload} = req

                const tokenId_exist = await req.payload.find(
                    {
                        collection:'refresh-token',
                        where:{
                         user:{
                            equals:user.id
                         }

                        }
                    }
                )
/*
                if(tokenId_exist) {
                    console.log("the resault is : ",tokenId_exist)
                    throw new Error("This user already logged in")
                }
                */
               console.log("the resault is : ",tokenId_exist)

                    // Create refresh token document
                  await req.payload.create({
                    collection: 'refresh-token',
                    data: {
                      tokenId: tokenId,
                      user: user.id,
                    },
                  })

        }catch(error){
            console.log("Message: ",error)
        }

                
  
}