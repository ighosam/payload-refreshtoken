import type { CollectionAfterLogoutHook } from 'payload';

const afterLogoutHook: CollectionAfterLogoutHook = async ({
  req,
}) => {
   
  console.log("YEAH YOU LOGGED OUT!!!!!")
}