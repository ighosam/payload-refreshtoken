import jwt from 'jsonwebtoken'
import { type PayloadRequest } from 'payload';



export const refreshTokenIdMatched = async (req:PayloadRequest,tokenId: string): Promise<boolean> =>{

        const tokenIdExist = await req.payload.find({
        collection:'refresh-token',
        where:{
         tokenId: {
            equals:tokenId
         }  
        },
        limit: 1
    }) 


    if(!(tokenIdExist.docs.length > 0)) return false

        return true

  
}
