import type {Plugin,Config, PayloadRequest,CollectionConfig,TypedUser} from 'payload'
import {refreshTokenCollection} from './collections/refreshTokenCollection.js'
import {refreshEndpoint} from './endpoint.js'
import { v4 as uuidv4 } from 'uuid'
 
interface PluginOptions {
  enabled?:boolean
  tokenExpiration?: number; // Make expiration configurable
  userCollectionSlug?: string; // Allow custom user collection slug
}

 export const payloadRefreshToken = (options?:PluginOptions):Plugin =>{
   return (incomingConfig:Config)=>{
    const userSlug = options?.userCollectionSlug || 'users';

    // Ensure the users collection exists
    if (!incomingConfig.collections?.some(c => c.slug === userSlug)) {
      throw new Error(`Refresh Token Plugin requires a "${userSlug}" collection`);
    }
       
    return {
        ...incomingConfig,
        collections:[
            ...(incomingConfig?.collections || []).map(collection=>{

                if(collection.slug === userSlug){        
                    return {
                        ...collection,
                        auth:{
                         //properly type the auth to CollectionConfig
                        ...(collection.auth || {} ) as CollectionConfig,
                            tokenExpiration:360000              
                        }
                    }
                }
                return collection
            }),
            refreshTokenCollection,       
        ],
        hooks:{
            ...(incomingConfig.hooks || {}),
          afterLogin: [
             async ({ req, user }:{req:PayloadRequest,user:TypedUser}) => {
                
                //generate refresh token
                const tokenId = uuidv4()
                const {payload} = req
                //get the secrete from config or process.env
                const secret = incomingConfig.secret

                //update refresh token collection.

                console.log("Secret is: ",secret)

               return Response.json({message:`This is the message: ${secret}`})
             }
          ]
        },
      
       endpoints:[
        ...(incomingConfig?.endpoints || []),
        refreshEndpoint
       ]
    }

    
   } 
}




