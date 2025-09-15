import type {Plugin,Config,CollectionConfig, IncomingAuthType} from 'payload'
import {refreshTokenCollection} from './collections/refreshTokenCollection.js'
import {createRefreshEndpoint} from './createRefreshEndpoint.js'
import {createAfterLogin} from './hooks/createAfterLogin.js'
import type { PluginOptions } from './types.js'
import {afterLogout} from './hooks/afterLogout.js'
import { createLogin } from './login.js'
import { createLogout } from './logout.js'


 export const payloadRefreshToken = (options:PluginOptions):Plugin =>{
    const afterLogin = createAfterLogin(options)
    const refreshEndpoint = createRefreshEndpoint(options)
    const loginEndpoint = createLogin(options)
    const logoutEndpoint = createLogout(options)

   return (incomingConfig:Config)=>{
    const userSlug = options?.userCollectionSlug || 'users';

    // Ensure the users collection exists
    if (!incomingConfig.collections?.some(c => c.slug === userSlug)) {
      throw new Error(`RefreshToken Plugin requires a "${userSlug}" collection`);
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
                        ...(collection.auth || {} ) as IncomingAuthType,
                            tokenExpiration:options?.accessTokenExpiration||3600,  
                        },
                        
                               hooks:{
                                ...(collection.hooks||{}),
                                afterLogin:[
                                    ...(collection.hooks?.afterLogin||[]),
                                    afterLogin,           
                                ],
                                afterLogout:[
                                    ...(collection.hooks?.afterLogout || []),
                                    afterLogout,
                                ]
                            },

                        endpoints:[
                      ...(collection.endpoints||[]),
                      loginEndpoint,
                      logoutEndpoint,
                    ]
                    }
                  
                }
                return collection
            }),
            refreshTokenCollection,       
        ],

      
       endpoints:[
        ...(incomingConfig?.endpoints || []),
       refreshEndpoint,
       
              
       ]
    }

    
   } 
  
}




