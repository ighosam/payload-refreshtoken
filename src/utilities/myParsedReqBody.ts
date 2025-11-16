import { addDataAndFileToRequest } from 'payload';
import type { PayloadRequest } from 'payload';

export class BodyParseError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'BodyParseError';
  }
}
/**
 * Safely parse request body in Payload v3.x
 * Supports JSON and multipart/form-data (via addDataAndFileToRequest)
 */
export async function parseRequestBody<T = any>(req: PayloadRequest): Promise<T> {
  // 1. Try parsing form-data first (this will populate req.data)
  await addDataAndFileToRequest(req);

  let body: any = (req as any).data ?? null;

  // 2. If no data found, fallback to JSON/text parsing
  if (!body) {
    try {
      body = await (req as any).json();
    } catch {
      try {
        const txt = await (req as any).text();
        body = txt ? JSON.parse(txt) : {};
      } catch {
        body = {};
      }
    }
  }

  return body as T;
}
