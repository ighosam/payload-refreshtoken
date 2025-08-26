import type { PayloadRequest } from "payload";

export const parseJsonBody = async <T>(req:PayloadRequest) =>{
  try {
    let body: T;
    
    // If body is a ReadableStream
    if (req.body && typeof (req.body as any).getReader === 'function') {
      const reader = (req.body as ReadableStream).getReader();
      const chunks: Uint8Array[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }
      
      const combined = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let position = 0;
      
      for (const chunk of chunks) {
        combined.set(chunk, position);
        position += chunk.length;
      }
      
      const text = new TextDecoder().decode(combined);
    return  body = JSON.parse(text) as T ;
    } else {
      // Body is already parsed
     return body = req.body as unknown as T ;
    }
    // Now use the parsed body with proper typing
  } catch (error) {
    console.error('Error:', error);
   return Response.json({ error: (error as Error).message },{status:400});
  }
} 
 
 