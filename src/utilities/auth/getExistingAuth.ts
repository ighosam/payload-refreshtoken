import type {AuthStrategy, CollectionConfig, IncomingAuthType} from 'payload'
import type { PluginOptions } from '../../types';




//export const getExistingAuth = (collection:CollectionConfig,options?:PluginOptions):CollectionConfig['auth']=>{
export const getExistingAuth = (collection:CollectionConfig,options?:PluginOptions):IncomingAuthType|boolean|undefined=>{
//const customAuthStrategy = createCustomAuthStrategy(options)

let existingAuth:IncomingAuthType|boolean|undefined|object;
// Convert boolean auth to proper config object
if (collection.auth === true) {
  existingAuth = collection.auth
} else if (collection.auth && typeof collection.auth === 'object') {
  existingAuth = {
    ...(collection.auth || {}),  
  };
}

  return existingAuth
}