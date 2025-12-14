import { type PayloadRequest } from "payload";
import { parse as parseCookies } from "cookie";
import { BodyParseError, parseRequestBody } from "./myParsedReqBody";
import { tokenNames } from "./tokenNames";

const {PAYLOADTOKEN,REFRESHTOKEN} = tokenNames()

// Define all valid token names
const VALID_TOKEN_NAMES = [PAYLOADTOKEN,REFRESHTOKEN] as const;


// Creates a union type: "access-token" | "refresh-token"
type TokenName = (typeof VALID_TOKEN_NAMES)[number];

/**
 * Extracts a token from the request safely.
 * Type-safe: Only allows predefined token names.
 */
export const getTokenFromRequest = async (
  req: PayloadRequest,
  tokenName: TokenName
): Promise<string | undefined> => {

  const getBodyToken = async (): Promise<string | undefined> => {
    try {
      const data = await parseRequestBody<Record<string, unknown>>(req);
      const token = typeof data?.[tokenName] === "string" ? data[tokenName] : undefined;
      return token;
    } catch (error) {
      if (error instanceof BodyParseError) return undefined;
     // console.warn("Unexpected error parsing body in getTokenFromRequest:", error);
      return undefined;
    }
  };

  // 1️⃣ Try from cookies first
  const rawCookieHeader = req.headers?.get("cookie") ?? "";
  const cookieToken = parseCookies(rawCookieHeader)?.[tokenName];

  // 2️⃣ Fallback to request body
  if (cookieToken) return cookieToken;

  const bodyToken = await getBodyToken();
  return bodyToken;
};
