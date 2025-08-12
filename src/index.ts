import type {Plugin,Config, PayloadRequest} from 'payload',
import {refreshTokenCollection} from './collections/refreshTokenCollection.js'
import type { RequestHandler } from 'express';

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
        server:{
           ...((incomingConfig as any).server || {}),
              preMiddleware: [
                ...((incomingConfig as any).server.preMiddleware || []),
          cookieParser() as RequestHandler,, // Add cookie parser middleware
    ],
        },
      
       endpoints:[
        ...(incomingConfig?.endpoints || []),
        {
            path: "/api/samtoken",
            method: "get",
            handler:
            

                async (req:PayloadRequest) =>{

                const { payload } = req;
                
    
                  


                return Response.json({message:'This is a test'})
            }
            
        }
       ]
    }

    
   } 
}




