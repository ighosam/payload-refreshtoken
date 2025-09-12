import type { CollectionAfterLogoutHook,PayloadRequest} from "payload";

export const afterLogout:CollectionAfterLogoutHook = async ({req})=>{

    console.log("YEAH YOU LOGGED OUT!!!!!")

 
const cookieValue = [
  `refreshToken= ''`, // Key=Value
  `Path=/`,              // Accessible across all paths
  `SameSite=None`,       // Required for cross-site usage
  `Secure`,              // Required with SameSite=None (HTTPS only)
  `HttpOnly`,            // Recommended for security (blocks JS access)
  `expires=${new Date(0)}`,       // Expires in 1 day (in seconds)
].join('; ');

const userPrefsCookie = [
  `payload-token=''`, // URL-encoded value
  `Path=/`,
  `SameSite=Strict`,    // Strict for sensitive actions
  `Secure`,
  `Max-Age=${new Date(0)}`,    // Expires in 30 days
  // Omitting HttpOnly to allow JS access (if needed)
].join('; ');

// delete refresh-token
     //delete any previous token id for this user
       const delete_tokenId =  await req.payload.delete({
        collection:'refresh-token',
        where:{
         user: {
            equals: req.user?.id
         }
        } 
       })


    return Response.json(
      {
        message:"YEAH YOU LOGGED OUT!!!!!"
      },{
      status:300,
      headers:{
        'content-type':'application/json',
        'set-cookie': [cookieValue,userPrefsCookie] as unknown as string // [cookieValue] if multiple cookies
      }
    })

    


}