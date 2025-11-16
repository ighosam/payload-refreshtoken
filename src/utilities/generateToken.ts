import type {PayloadRequest} from 'payload'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import type { PluginOptions } from '../types.js'
import type { UserData } from '../types.js'

//export const generateRefreshToken = async (req:PayloadRequest,options?:PluginOptions)=>{
export const generateRefreshToken = async (req:PayloadRequest)=>{
    //const expiresIn = req.payload.config.custom.refreshTokenExpiration || process.env.JWT_REFRESH_EXPIRATION
    const expiresIn = req.payload.config.custom.refreshOptions.refreshTokenExpiration

    console.log("ExpiresIn is: ",expiresIn)
    try{
    //const secret = process.env.PAYLOAD_SECRET || 'fasfasfasf'
    //const refreshSecret = process.env.PAYLOAD_SECRET
    const refreshSecret = req.payload.secret

  
   if(!refreshSecret) throw new Error("no secret found, Please set up PAYLOAD_SECRET in .env file")

    const tokenId = uuidv4()


    const refreshPayload = {
        tokenId:tokenId, 
        collection:"user",
        id: req.user?.id  
    }

    const token = jwt.sign(refreshPayload,refreshSecret,{
      expiresIn: expiresIn as number, // or 3600 etc
    })

    console.log("TOKEN FROM GEN IS: ",token)

    const tokenIdExist = await req.payload.find({
        collection:'refresh-token',
        where:{
         user: {
            equals:req.user?.id
         }  
        },
        limit: 1
    })

    if(tokenIdExist.docs.length > 0 ){
        //update, this is a case of an expired access token
        const updateTokenId = await req.payload.update({
            collection:"refresh-token",
            data:{
               tokenId: tokenId,  
            },
            where:{
                user:{
                    equals: req.user?.id 
                }
            }
        })
    }else{
        //create, this is a case of a login
           await req.payload.create({
                    collection: 'refresh-token',
                    data: {
                      tokenId: tokenId,
                      user:req.user?.id,
                    },
                  })
    }
    return token 

}catch(error){
   //if an error occurs return a null.
   //console.log("this is the error that occours: ",error)
    return null
}

}
export const generateAccessToken = async (req:PayloadRequest)=>{
    //const secret = process.env.PAYLOAD_SECRET
    const secret = req.payload.secret
    const expiresIn = req.payload.config.custom.refreshOptions.accessTokenExpiration

    try{
        if(!expiresIn) throw new Error("expiereIn not found, please set up JWT_ACCESS_EXPIRATION in .env file")
        if(!secret) throw new Error("no secret found,  Please set up PAYLOAD_SECRET in .env file")
    
             const accessPayload = {
                 id:req.user?.id,
                 email:req.user?.email,
                 collection:'users'
              }
               const token = jwt.sign(accessPayload,secret,{
                expiresIn: expiresIn as number, // or 3600 etc
    })
       return token

    }catch(error){
       
    }


}