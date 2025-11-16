import type { CollectionConfig } from "payload";


export type RefreshCollection = CollectionConfig & {
    auth:{
        disableLocalStrategy?: boolean;
  }
}

export interface PluginOptions {
  enabled?:boolean
  accessTokenExpiration?: number; // Make expiration configurable
  refreshTokenExpiration?:number
  userCollectionSlug?: string; // Allow custom user collection slug
}

export type UserData ={
  id: number,
  email:string,
  collection:string
}