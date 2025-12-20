import { getTokenFromRequest } from "../utilities/getTokenFromRequest.js";
import { tokenNames } from "../utilities/tokenNames.js";


export const beforeLogin = async ({user})=>{
 // const {REFRESHTOKEN} = tokenNames()
  //  const refreshToken = getTokenFromRequest(req,REFRESHTOKEN)
 // if (!refreshToken) return

  /* it is possible for after logout to run multiple times, 
     so the code written here should not be blocking, use try catch
     and respond to any error, the code will run without error regardless
  */

   console.log("YEAH YOU ARE ABOUT TO LOGIN!!!!!: ") 
  
   return user
}