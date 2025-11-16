import { type Endpoint, type PayloadRequest } from "payload";
import type { PluginOptions } from "./types.js";
import { generateAccessToken, generateRefreshToken } from "./utilities/generateToken.js";
import { getTokenFromRequest } from "./utilities/getTokenFromRequest.js";
import { isRefreshTokenValid } from "./utilities/isRefreshTokenValid.js";

  export const refreshEndpoint: Endpoint = {
    path: "/refresh-token",
    method: "post",
    handler: async (req: PayloadRequest) => {
      // 1. Extract refresh token from request (cookie, body, or header)
      const reqRefreshToken = await getTokenFromRequest(req, "refreshToken");

      if (!reqRefreshToken) {
        return Response.json(
          { error: "Refresh token is required" },
          { status: 400 }
        );
      }

      // 2. Validate refresh token
      const refreshTokenIsValid = await isRefreshTokenValid(req, reqRefreshToken);

      if (!refreshTokenIsValid) {
        return Response.json(
          { error: "Invalid or expired refresh token" },
          { status: 401 }
        );
      }

      // 3. Prepare user info for new token generation
      const user = req.user;
      if (!user?.id || !user?.email) {
        return Response.json(
          { error: "User not found or invalid request context" },
          { status: 400 }
        );
      }

      // 4. Generate new tokens
      const refreshToken = await generateRefreshToken(req);
      const accessToken = await generateAccessToken(req);

      // 5. Build cookies
      const refreshCookie = [
        `refreshToken=${refreshToken}`,
        `Path=/`,
        `SameSite=Lax`,
        `Secure`,
        `HttpOnly`,
        `Max-Age=${req.payload.config.custom.refreshOptions.refreshTokenExpiration}`, // seconds
      ].join("; ");

      const accessCookie = [
        `payload-token=${accessToken}`,
        `Path=/`,
        `SameSite=Lax`,
        `Secure`,
        `HttpOnly`,
        `Max-Age=${req.payload.config.custom.refreshOptions.accessTokenExpiration}`, // seconds
      ].join("; ");

      // 6. Return response
      return Response.json(
        {
          "payload-token": accessToken,
          refreshToken,
        },
        {
          status: 200,
          headers: {
            "content-type": "application/json",
            "set-cookie": [refreshCookie, accessCookie] as unknown as string,
          },
        }
      );
    },
  };

