import type {AuthCollection, AuthStrategy, CollectionConfig, IncomingAuthType} from 'payload'
import type { PluginOptions } from '../../types.js';

export const getExistingStrategy = (collection:CollectionConfig,options?:PluginOptions):AuthStrategy[]|undefined =>{

let existingStrategy:AuthStrategy[]|undefined;
// Convert boolean auth to proper config object
if (collection.auth === true) {
  existingStrategy = []
} else if (collection.auth && typeof collection.auth === 'object') {
  existingStrategy = (collection.auth.strategies||[])
}
 return existingStrategy
}