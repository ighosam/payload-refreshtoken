import type { CollectionAfterLogoutHook,PayloadRequest} from "payload";

;
import jwt from 'jsonwebtoken'
import { tokenNames } from "../utilities/tokenNames.js";

export const afterLogout:CollectionAfterLogoutHook = async ({req})=>{


  //const accessToken = await getTokenFromRequest(req,'payload-token')

  
  //onst deleted =   await deleteRefreshTokenId(req.payload,tokenId)
   console.log("YEAH YOU LOGGED OUT!!!!!: ") 
         
return 'success'

}