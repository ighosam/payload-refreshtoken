import type { Endpoint, PayloadRequest } from "payload";
import jwt from 'jsonwebtoken'


export const refreshEndpoint:Endpoint = {
    path: "/refresh-token",
    method: "post",
    handler: async(req:PayloadRequest)=>{


// 1 validate refreshtoken
//when requesting for refresh either pass the present
//refresh token or read it from httponly cookie

 const { payload,body,user } = req;


 

  if(!user) return Response.json({message:"this is crazy"},{status:401})

//2 check database if token id exist and compare the tokenId


//3 generate refreshtoken.

    return Response.json({message:"you got it"})
    }

}