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
            name: "tokenID",
            type: "text"
        },
        {
            name: "user",
            type: "relationship",
            relationTo:"users"
        }
    ]

}