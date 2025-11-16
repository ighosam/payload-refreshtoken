import type { Plugin, Config, CustomComponent} from 'payload'
import { refreshTokenCollection } from './collections/refreshTokenCollection.js'
import { refreshEndpoint } from './refreshEndpoint.js'
import {loginEndpoint} from './login.js'
import {logoutEndpoint} from './logout.js'
import {afterLogin} from './hooks/afterLogin.js'
import { afterLogout } from './hooks/afterLogout.js'
import { getExistingAuth } from './utilities/auth/getExistingAuth.js'
import { getExistingStrategy } from './utilities/auth/getExistingStrategy.js'
import type { PluginOptions } from './types.js'
import InactivityNotice from './componenet/InactivityNotice.js'
import CustomInactivity from './componenet/CustomInactivity.js'

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
          custom:{
            ...(incomingConfig.custom||{}),
            refreshOptions:options
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
        afterNavLinks: [
          ...(incomingConfig.admin?.components?.afterNavLinks || []),
         
        ],
           beforeLogin: [
        ...(incomingConfig.admin?.components?.beforeLogin || []),
            InactivityNoticeC,
      ],
         views:{
          CustomInactivity:{
            Component:CustomInactivityC,
            path:'/custom-inactivity'
          }
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
            
            auth: {
              existingAuth,

              strategies: [...(existingStrategy || [])],
            refreshTokens: true, 
             tokenExpiration: options?.accessTokenExpiration || 60 * 2, // 3 minutes
              
             //place plugin options in config for easy access at runtime
            
            },
            
            hooks: {
              ...(collection.hooks || {}),
              afterLogin: [...(collection.hooks?.afterLogin || []), afterLogin],
              afterLogout: [
                ...(collection.hooks?.afterLogout || []),
                afterLogout
              ],
            
            },
            endpoints: [
              ...(collection.endpoints || []),
              loginEndpoint,
              logoutEndpoint,
              refreshEndpoint
             
            ],  
              
          } 
         
        }),
       refreshTokenCollection,
      ],
      
    }
  }
}
