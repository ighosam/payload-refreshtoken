import type {Plugin,Config, PayloadRequest} from 'payload',
import {refreshTokenCollection} from './collections/refreshTokenCollection.js'
import {refreshEndpoint} from './endpoint.js'
 interface PluginOptions {
    enabled?:boolean
}

 export const payloadRefreshToken = (options?:PluginOptions):Plugin =>{
   return (incomingConfig:Config)=>{
       
    return {
        ...incomingConfig,
        collections:[
            ...(incomingConfig?.collections || []),
            refreshTokenCollection
        ],
      
       endpoints:[
        ...(incomingConfig?.endpoints || []),
        refreshEndpoint
       ]
    }

    
   } 
}




