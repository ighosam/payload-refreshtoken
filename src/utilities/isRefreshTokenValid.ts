import jwt from 'jsonwebtoken'
import { type Payload, type PayloadRequest } from 'payload';

export const isRefreshTokenValid = async (req:PayloadRequest,token: string): Promise<boolean> =>{
const { TokenExpiredError } = jwt

const deleteRefreshTokenId = async (req:PayloadRequest,tokenId:string)=>{
       await req.payload.delete({
                    collection: 'refresh-token',
                    where: {
                     tokenId:{
                        equals:tokenId,
                     }, 
                    },
                  })
          }

       let tokenId
     try {
        const secret = req.payload.secret
        if (!secret||secret === '') throw new Error("Invalid secret") 
       
          console.log("there is secret")
   const decoded = jwt.verify(token,secret ) as jwt.JwtPayload
   const {collection,userId,iat,exp} = decoded
    tokenId = decoded.tokenId
   console.log("refresh-token is deocoded: ",tokenId)
      //find the tokenId for this user in database
        const tokenIdExist = await req.payload.find({
        collection:'refresh-token',
        where:{
         user: {
            equals:userId
         }  
        },
        limit: 1
    }) 

    console.log("token-exist in db: ",tokenIdExist.docs[0]?.tokenId)
    if(!(tokenIdExist.docs.length > 0)) throw Error("NO TOKENID REFRENCE IN DB")
    if(tokenId != tokenIdExist.docs[0]?.tokenId )throw Error ("TOKEN_ID DON'T MATCH")
  
     return true

  } catch (error: any) {
    // Other errors (invalid signature, malformed token)
      if (error instanceof jwt.TokenExpiredError || error.message === "TOKEN_ID DON'T MATCH") {
    //This user has expired or invalidated refresh token (delete tokenId from db)

        deleteRefreshTokenId(req,tokenId)
  } else if (error instanceof jwt.JsonWebTokenError) {
    // handle invalid token
    return false
  }

    return false
  }
}
