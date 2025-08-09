import type {Plugin,Config, PayloadRequest} from 'payload',
import {refreshTokenCollection} from './collections/refreshTokenCollection.js'

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
        {
            path: "/",
            method: "post",
            handler: async (req:PayloadRequest,next) =>{

                const { payload } = req;

                return ''
            }
        }
       ]
    }

    
   } 
}




