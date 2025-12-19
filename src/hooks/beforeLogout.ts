import type { CollectionAfterLogoutHook,PayloadRequest} from "payload";
import type { TypedUser } from "payload";
import { getTokenFromRequest } from "../utilities/getTokenFromRequest.js";
import jwt from 'jsonwebtoken'
import { tokenNames } from "../utilities/tokenNames.js";


export const beforeLogout = async ({req})=>{
  const {REFRESHTOKEN} = tokenNames()
    const refreshToken = getTokenFromRequest(req,REFRESHTOKEN)
  if (!refreshToken) return

  /* it is possible for after logout to run multiple times, 
     so the code written here should not be blocking, use try catch
     and respond to any error, the code will run without error regardless
  */

   console.log("YEAH YOU LOGGED OUT!!!!!: ") 
         
}