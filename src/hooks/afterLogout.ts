import type { CollectionAfterLogoutHook,PayloadRequest} from "payload";
import {deleteRefreshTokenId} from '../utilities/deleteRefreshTokenId.js'

export const afterLogout:CollectionAfterLogoutHook = async ({req})=>{
     deleteRefreshTokenId(req)
   console.log("YEAH YOU LOGGED OUT!!!!!",req.user?.email
      
    ) // Call your logout endpoint to clear HttpOnly cookies
          
return req.user

}