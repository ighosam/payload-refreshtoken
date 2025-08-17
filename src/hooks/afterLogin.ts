import type { CollectionAfterLoginHook } from 'payload'
import { v4 as uuidv4 } from 'uuid'

export const afterLogin:CollectionAfterLoginHook = ({req,user})=>{

    console.log("THIS IS WERE THE RUBER MEET THE ROAD")

                console.log("I GOT HERE")
                
                //generate refresh token
                const tokenId = uuidv4()
                const {payload} = req
                //get the secrete from config or process.env
                //update refresh token collection.

                console.log("Secret is =============++++++++++: ",tokenId)

               return Response.json({message:`This is the message: ${tokenId}`})
             
  
}