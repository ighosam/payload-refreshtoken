import type { CollectionAfterRefreshHook } from 'payload';

export const afterRefresh: CollectionAfterRefreshHook = async ({
  req,
}) => {
   
  console.log("YEAH YOU REFRESHED!!!!!")
  return null
}