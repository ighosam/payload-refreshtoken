import type {Plugin,Config, PayloadRequest,CollectionConfig,TypedUser, CollectionAfterLoginHook} from 'payload'
import {refreshTokenCollection} from './collections/refreshTokenCollection.js'
import {refreshEndpoint} from './endpoint.js'
import {afterLogin} from './hooks/afterLogin.js'
 
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
                            tokenExpiration:360000,
                            //auth:true,    
                            ///
                        },
                               hooks:{
                                ...(collection.hooks||{}),
                                afterLogin:[
                                    ...(collection.hooks?.afterLogin||[]),
                                    afterLogin,
                                       
                                ],
                            }

                        /*
                       hooks:{
                        afterLogin:[
                           ...(collection.hooks?.afterLogin||[])  
                        ]
                       }
                        */
                    }
                }
                return collection
            }),
            refreshTokenCollection,       
        ],

      
       endpoints:[
        ...(incomingConfig?.endpoints || []),
        refreshEndpoint
       ]
    }

    
   } 
}




