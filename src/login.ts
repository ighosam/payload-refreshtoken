import { type Endpoint, type PayloadRequest } from "payload";
import { generateRefreshToken } from './utilities/generateToken.js';
import { parseRequestBody } from "./utilities/myParsedReqBody.js";
import jwt from 'jsonwebtoken';
import type { PluginOptions } from './types.js';

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

            // Construct a simplified user object (optional, useful for frontend)
            const userArg = {
                id: user.id as number,
                email: user.email as string,
                collection: "user",
            };

            // Generate a custom refresh token
            const refreshToken = await generateRefreshToken(req) as string;

            // Set HTTP-only cookies for access and refresh tokens
            const headers = new Headers();
            headers.append(
                'set-cookie',
                `refreshToken=${refreshToken}; HttpOnly; Path=/; SameSite=Lax; Secure`
            );
            headers.append(
                'set-cookie',
                `payload-token=${token}; HttpOnly; Path=/; SameSite=Lax; Secure`
            );

            // Return user info and tokens as JSON with cookies set
            return Response.json(
                { user, token, refreshToken, exp },
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
