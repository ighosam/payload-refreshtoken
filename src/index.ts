import type {Plugin,Config, PayloadRequest,CollectionConfig,TypedUser, CollectionAfterLoginHook} from 'payload'
import {refreshTokenCollection} from './collections/refreshTokenCollection.js'
import {createRefreshEndpoint} from './createRefreshEndpoint.js'
import {createAfterLogin} from './hooks/createAfterLogin.js'
import type { PluginOptions } from './types.js'


 export const payloadRefreshToken = (options:PluginOptions):Plugin =>{
    const afterLogin = createAfterLogin(options)
    const refreshEndpoint = createRefreshEndpoint(options)

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
                            tokenExpiration:options?.accessTokenExpiration||3600
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




