
import  {type CollectionBeforeOperationHook,APIError } from 'payload'

export const beforeOperationHook: CollectionBeforeOperationHook = async ({
  args,
  operation,
  req,
}) => {
    
   const isDefault = req.url?.includes('login')

   console.log("isDefault is: ",isDefault)

     if ((operation === "login") && isDefault) {
    const referer = req.headers.get('referer') || "";
   

  if(referer === ''){
   throw new APIError('External login is disabled', 403) 
  }

   const isFromAdminUI = referer.includes('/admin') 

if (!isFromAdminUI) {   
        throw new APIError('External login is disabled', 403)
} 

  }
return
  
}