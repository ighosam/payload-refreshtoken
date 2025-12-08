import type { Plugin, Config, CustomComponent} from 'payload'
import { refreshTokenCollection } from './collections/refreshTokenCollection.js'
import { refreshEndpoint } from './routes/refreshEndpoint.js'
import {loginEndpoint} from './routes/login.js'
import {logoutEndpoint} from './routes/logout.js'
import {afterLogin} from './hooks/afterLogin.js'
import { afterLogout } from './hooks/afterLogout.js'
import { getExistingAuth } from './utilities/auth/getExistingAuth.js'
import { getExistingStrategy } from './utilities/auth/getExistingStrategy.js'
import type { PluginOptions } from './types.js'
import InactivityNotice from './componenet/InactivityNotice.js'
import {CustomInactivity} from './componenet/CustomInactivity.js'
import {CustomLogoutButton} from './componenet/CustomLogoutButton.js'
import { revokeRefreshEndpoint } from './routes/revokeRefreshEndpoint.js'

const InactivityNoticeC  = InactivityNotice  as unknown as CustomComponent
const CustomInactivityC  = CustomInactivity  as unknown as CustomComponent

export const payloadRefreshToken = (options: PluginOptions): Plugin =>  {
 
  return (incomingConfig: Config): Config => { 
    if(!options.enabled)return incomingConfig
       
    const userSlug = options?.userCollectionSlug || 'users'

    if (!incomingConfig.collections?.some(c => c.slug === userSlug)) {
      throw new Error(`RefreshToken Plugin requires a "${userSlug}" collection`)
    }

    // ✅ No importMap — absolute paths only
   
    return {
      ...incomingConfig,
     
      plugins:[
         ...(incomingConfig.plugins || [])
      ],
      //declear variables you will like to have global access to
          custom:{
            ...(incomingConfig.custom||{}),
            refreshOptions:options,
          },
          
      admin: {
        ...(incomingConfig.admin || {}),
         routes:{
        inactivity:'/custom-inactivity',
        },
       
        components: {
          
          ...(incomingConfig.admin?.components || {}),
          
          beforeDashboard: [
            ...(incomingConfig.admin?.components?.beforeDashboard || []),
           
          ],
          afterDashboard:[
           ...(incomingConfig.admin?.components?.afterDashboard || []),
           
          ],
          beforeNavLinks:[
           ...(incomingConfig.admin?.components?.beforeNavLinks || []),
          ],

        afterNavLinks: [
          ...(incomingConfig.admin?.components?.afterNavLinks || []),
            
        ], 
           beforeLogin: [
        ...(incomingConfig.admin?.components?.beforeLogin || []),
            InactivityNoticeC,
           
      ],
        afterLogin:[
          ...(incomingConfig.admin?.components?.afterLogin || []),
        ],
    
       
        logout:{
         ...(incomingConfig.admin?.components?.logout || []),
         Button: CustomLogoutButton as unknown as CustomComponent,
          
       },
         views:{
          CustomInactivity:{
            Component:CustomInactivityC,
            path:'/custom-inactivity'
          },
       
         } 
            
        },  
      },
      
      collections: [
        ...(incomingConfig.collections || []).map(collection => {
          if (collection.slug !== userSlug) return collection

          const existingAuth = getExistingAuth(collection, options)
          const existingStrategy = getExistingStrategy(collection, options)

          return {
            ...collection,
            
            admin:{
              ...(collection.admin||{}),
             
            },
            
            auth: { 
             existingAuth,
             //enable:true,    
             strategies: [...(existingStrategy || [])],
             refreshTokens: true, 
             tokenExpiration: options?.accessTokenExpiration || 60 * 3, // 2 minutes
          
             ///////////////////////////////
              /*
              refresh: {
              interval: 2 * 60 * 1000, // 5 minutes
              method: async (args:any) => {
              const { collection, req, res, token } = args;

             console.log("CALL THIS ENDPOINT EVERY 1 MINUTE")
             }
            },
            */
             ////////////////////////////////
             
            },
            
            hooks: {
              ...(collection.hooks || {}),
              afterLogin: [...(collection.hooks?.afterLogin || []), afterLogin],
              
              afterLogout: [
                ...(collection.hooks?.afterLogout || []),
               afterLogout
              ],
              beforeLogin:[
                ...(collection.hooks?.beforeLogin || []),
               
              ]
                   
            },
            endpoints: [
              ...(collection.endpoints || []),
              loginEndpoint,
              logoutEndpoint,
              refreshEndpoint,
              revokeRefreshEndpoint      
            ],  
              
          } 
         
        }),
       refreshTokenCollection,
      
      ]
      
    }
  }
}
