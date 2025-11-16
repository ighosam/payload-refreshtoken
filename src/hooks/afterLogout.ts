import type { CollectionAfterLogoutHook,PayloadRequest} from "payload";

export const afterLogout:CollectionAfterLogoutHook = async ({req})=>{
    
   console.log("YEAH YOU LOGGED OUT!!!!!",req.user?.email
      
    ) // Call your logout endpoint to clear HttpOnly cookies
          
return req.user

}