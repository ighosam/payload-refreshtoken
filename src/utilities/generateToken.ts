import type {PayloadRequest} from 'payload'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

//export const generateRefreshToken = async (req:PayloadRequest,options?:PluginOptions)=>{
export const generateRefreshToken = async (req:PayloadRequest,sid:string)=>{
    //const expiresIn = req.payload.config.custom.refreshTokenExpiration || process.env.JWT_REFRESH_EXPIRATION
    const secret = req.payload.secret
    const expiresIn = req.payload.config.custom.refreshOptions.refreshTokenExpiration

    try{
    //const secret = process.env.PAYLOAD_SECRET || 'fasfasfasf'
    //const refreshSecret = process.env.PAYLOAD_SECRET
    

  
   if(!secret || !expiresIn) throw new Error("Missing secret or refresh expiration")

    const tokenId = uuidv4()
    const userId = req.user?.id;

    const refreshPayload = {
        tokenId:tokenId,
        userId, 
        collection:"users",
         sid,
    }
    
    const refreshToken = jwt.sign(refreshPayload,secret,{
      expiresIn: expiresIn as number, // or 3600 etc
    })

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
    return refreshToken 

}catch(error){
   //if an error occurs return a null.
    return null
}

}
export const generateAccessToken = async (req:PayloadRequest,sid:string)=>{
  
    const secret = req.payload.secret
    const expiresIn = req.payload.config.custom.refreshOptions.accessTokenExpiration
    
    try{
        if(!expiresIn || !secret) throw new Error("Missing secret or access expiration")
    const user = req.user
             const accessPayload = {
                 id:user?.id,
                 collection:"users",
                 email:user?.email,
                 sid: sid
              }
              return jwt.sign(accessPayload,secret,{
                expiresIn: expiresIn as number, // or 3600 etc
    })
       

    }catch(error){

        return null
       
    }


}