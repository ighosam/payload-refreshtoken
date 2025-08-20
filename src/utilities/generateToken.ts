import type {TypedUser,PayloadRequest} from 'payload'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

export const generateRefreshToken =(req:PayloadRequest)=>{

    try{
    //const secret = process.env.PAYLOAD_SECRET || 'fasfasfasf'
    const refreshSecret = process.env.PAYLOAD_SECRET
   if(!refreshSecret) throw new Error("no secret found, Please set up PAYLOAD_SECRET in .env file")

    const tokenId = uuidv4()

    const refreshPayload = {
        tokenId:tokenId, 
        collection:'users',
        id: req.user?.id  
    }
    const token = jwt.sign(refreshPayload,refreshSecret,{
      expiresIn: '7d', // or '30d', '1y', etc
    })

    return token

}catch(error){
    console.log("Message: ",error)
    return null
}


}

export const generateAccessToken =(req:PayloadRequest)=>{
    const secret = process.env.PAYLOAD_SECRET

    try{
        if(!secret) throw new Error("no secret found,  Please set up PAYLOAD_SECRET in .env file")
            
      
             const accessPayload = {
                 id:req.user?.id,
                 email:req.user?.email,
                 collection:'users'
              }
               const token = jwt.sign(accessPayload,secret,{
                expiresIn: '7d', // or '30d', '1y', etc
    })

       return token

    }catch(error){
       console.log("Message: ",error)
    }


}