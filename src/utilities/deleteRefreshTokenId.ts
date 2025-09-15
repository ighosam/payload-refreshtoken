import type {PayloadRequest} from 'payload'

export const deleteRefreshTokenId = async (req:PayloadRequest)=>{

try{

await req.payload.delete({
                    collection: 'refresh-token',
                    where: {
                     user:{
                        equals:req.user?.id,
                     }, 
                    },
                  })
}catch(error){
throw new Error(`There seems to be an error ${error}`)
}
    
}