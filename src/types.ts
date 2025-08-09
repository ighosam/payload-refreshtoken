import type { CollectionConfig } from "payload";


export type RefreshCollection = CollectionConfig & {
    auth:{
        disableLocalStrategy?: boolean;
  }
}