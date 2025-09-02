## Add refresh token to payload cms to payload cms app

This plugin will help transform the payload cms to implement refresh token.

refrshToken collection will be created to save token id and relate the collection to user collection.

Step 1.
======
    Generate the tsconfig.json file using tsc --init 
    typescript must be installed on your system to use the command above.
# Set JWT_ACCEESS_EXPIRATION AND JWT_REFRESH_EXPIRATION IN .env
    JWT_ACCESS_EXPIRATION
    JWT_REFRESH_EXPIRATION
    variables in .env file in your main application and or

    set plugin options in configuration file e.g:

       payloadRefreshToken({
      enabled:true,
      refreshTokenExpiration:86400,
      accessTokenExpiration:600
    })


    