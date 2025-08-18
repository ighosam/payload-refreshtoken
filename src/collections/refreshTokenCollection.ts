import type {RefreshCollection} from '../types.js'

export const refreshTokenCollection:RefreshCollection = {

    slug: 'refresh-token',
    auth:{
       disableLocalStrategy:true 
    }, 
    access: {
        create: () => true,
        read: () => true,
        update: () => true,
        delete: () => true,
      },
    fields:[
        {
            name: "tokenId",
            type: "text",
            required:true
        },
        {
            name: "user",
            type: "relationship",
            relationTo:"users",
            required:true
        }
    ]

}