import type { Endpoint, PayloadRequest } from "payload";

export const refreshEndpoint:Endpoint = {
    path: "/",
    method: "post",
    handler: async(req:PayloadRequest)=>{

// 1 validate refreshtoken


//2 check database if token id exist and compare the tokenId


//3 generate refreshtoken.

    return Response.json({message:"you got it"})
    }

}