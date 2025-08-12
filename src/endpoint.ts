import { generatePayloadCookie, type Endpoint, type PayloadRequest } from "payload";
import jwt from 'jsonwebtoken'
import {parse as parseCookies } from 'cookie'

//import { extractRefreshToken, extractAccessToken } from 'payload/auth'


export const refreshEndpoint:Endpoint = {
    path: "/refresh-token",
    method: "get",
    handler:  async(req:PayloadRequest)=>{
     

const rawCookieHeader = req.headers.get('cookie')

const cookies = parseCookies(rawCookieHeader || '')

const token = cookies['payload-token'] // or whatever cookie name you expect

//Now you can verify or decode the JWT, or use it further

//refresh token or read it from httponly cookie

const data = req?.body
//const cookies = (req as PayloadRequest &{cookies:Record<string,string>}).cookies
const {user} = req


//const cookie = req.headers.getSetCookie()


 

  if(!req.user) return Response.json({message:"this is crazy"},{status:401})

//2 check database if token id exist and compare the tokenId


//3 generate refreshtoken.

    return Response.json({message:"you got it"})
    }


}