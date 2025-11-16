import type {PayloadRequest} from 'payload'

export const deleteRefreshTokenId = async (req:PayloadRequest)=>{
try{ 
    //if tokenId exist delete it from the db.
  const tokenIdExist = await req.payload.delete({
                    collection: 'refresh-token',
                    where: {
                     user:{
                        equals:req.user?.id,
                     }, 
                    },
                  })

if( !(tokenIdExist.docs.length > 0) ) throw new Error('no file match')         
}catch(error){
throw new Error(`There seems to be an error:  ${error}`)
}
    
}