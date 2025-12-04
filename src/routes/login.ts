import { type Endpoint, type PayloadRequest } from "payload";
import { generateRefreshToken } from '../utilities/generateToken.js';
import { parseRequestBody } from "../utilities/myParsedReqBody.js";
import jwt from 'jsonwebtoken';
import type { PluginOptions } from '../types.js';
import { tokenNames } from "../utilities/tokenNames.js";

type AuthType = {
    email: string;
    password: string;
}

// Login endpoint for Payload CMS
export const loginEndpoint: Endpoint = {
    path: "/login",
    method: "post",
    handler: async (req: PayloadRequest) => {
 
        // Destructure JWT error type (optional, for future error handling)
        const { TokenExpiredError } = jwt;


        // Parse incoming request body (using custom parser utility)
        const data = await parseRequestBody(req);
        const { email, password } = data;

        // Basic validation
        if (!email) throw new Error("Email is required");
        if (!password) throw new Error("Password is required");

        try {
            // Attempt login using Payload's built-in login method
            const { user, token, exp } = await req.payload.login({
                collection: "users",
                data: { email, password },
                req,
            });
            //verify the token here and save sid to context 
            if(!token) throw new Error("Unable to complete login")
            const decoded = jwt.verify(token,req.payload.secret ) as jwt.JwtPayload
            const {sid} = decoded
            


         //make sure req.user is always defined mostly for admin UI
          if(!req.user || req.user === null) req.user = user

            
            // Generate a custom refresh token
            const refreshResault = await generateRefreshToken(req,sid) as string;

            // Set HTTP-only cookies for access and refresh tokens
            const headers = new Headers();
            const {REFRESHTOKEN,PAYLOADTOKEN} = tokenNames()
            
            headers.append(
                'set-cookie',
                `${REFRESHTOKEN}=${refreshResault}; HttpOnly; Path=/; SameSite=Lax; Secure`
            );
            
            headers.append(
                'set-cookie',
                `${PAYLOADTOKEN}=${token}; HttpOnly; Path=/; SameSite=Lax; Secure`
            );
           
            // Return user info and tokens as JSON with cookies set
           console.log("secret is: ",req.payload.secret)
            return Response.json(
                { user, token, refreshResault, exp },
                { status: 200, headers }
            );



        } catch (error) {
            // Catch login failures (invalid credentials)
            return Response.json(
                { error: 'Invalid credentials' },
                { status: 405 }
            );
        }
    }
};
