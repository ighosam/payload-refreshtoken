import type {Plugin,Config} from 'payload'

export interface PluginOptions {
    enabled?:boolean
}

export const payloadRefreshToken = (options?:PluginOptions):Plugin =>{
   return (incomingConfig:Config)=>{
       
    return {
        ...incomingConfig
    }

    
   } 
}


