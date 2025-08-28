import { type PayloadRequest } from "payload";

export class BodyParseError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'BodyParseError';
  }
}

export const parseJsonBody = async <T>(req: PayloadRequest): Promise<T> => {
  try {
    let rawBody: string | undefined;

    // If body is already parsed object
    if (req.body && typeof req.body === 'object' && !(req.body instanceof ReadableStream)) {
      return req.body as unknown as T;
    }

    // Get raw text from various sources
    if (typeof req.text === 'function') {
      rawBody = await req.text();
    } else if (req.body instanceof ReadableStream) {
      const response = new Response(req.body);
      rawBody = await response.text();
    } else if (typeof req.body === 'string') {
      rawBody = req.body;
    }

    if (!rawBody) {
      throw new BodyParseError('No body content found');
    }

    return JSON.parse(rawBody) as T;
    
  } catch (error) {
    if (error instanceof BodyParseError) {
      throw error;
    }
    
    throw new BodyParseError(
      error instanceof Error ? error.message : 'Unknown error parsing JSON body',
      error
    );
  }
};

// Usage example:
// try {
//   const data = await parseJsonBody<MyType>(req);
// } catch (error) {
//   if (error instanceof BodyParseError) {
//     return Response.json({ error: error.message }, { status: 400 });
//   }
//   throw error;
// }