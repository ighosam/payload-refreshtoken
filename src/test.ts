import type { Plugin, Config, PayloadRequest, Collection, CollectionConfig } from 'payload'
import { refreshTokenCollection } from './collections/refreshTokenCollection.js'
import { refreshEndpoint } from './createRefreshEndpoint.js'

interface PluginOptions {
  enabled?: boolean
  tokenExpiration?: number // Make expiration configurable (in milliseconds)
  userCollectionSlug?: string // Allow custom user collection slug
}

export const payloadRefreshToken = (options?: PluginOptions): Plugin => {
  return (incomingConfig: Config) => {
    const userSlug = options?.userCollectionSlug || 'users'
    const tokenExpiration = options?.tokenExpiration || 360000

    // Ensure the users collection exists
    if (!incomingConfig.collections?.some(c => c.slug === userSlug)) {
      throw new Error(`Refresh Token Plugin requires a "${userSlug}" collection`)
    }

    return {
      ...incomingConfig,
      collections: [
        ...(incomingConfig?.collections || []).map(collection => {
          if (collection.slug === userSlug) {
            
            return {
              ...collection,
              auth:{
                //properly type the auth to CollectionConfig
                ...(collection.auth || {} ) as CollectionConfig,
                tokenExpiration,
                
              }
            }
          }
          return collection
        }),
        refreshTokenCollection,
      ],
      endpoints: [
        ...(incomingConfig?.endpoints || []),
        refreshEndpoint
      ]
    }
  }
}