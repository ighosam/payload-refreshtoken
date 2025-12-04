import type {Payload} from 'payload'

export const deleteRefreshTokenId = async (payload:Payload,tokenId:string)=>{
try{ 
    //if tokenId exist delete it from the db.
  const tokenIdExist = await payload.delete({
                    collection: 'refresh-token',
                    where: {
                     tokenId:{
                        equals:tokenId,
                     }, 
                    },
                  })

if( !(tokenIdExist.docs.length > 0) ) throw new Error('no file match') 
  return "success"        
}catch(error){
throw new Error(`There seems to be an error:  ${error}`)
}
    
}