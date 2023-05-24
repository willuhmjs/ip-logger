import { ConnInfo, Handler, serve } from "https://deno.land/std@0.187.0/http/server.ts";

const handler: Handler = (req: Request, connInfo: ConnInfo): Response => {
  const headers = req.headers;
  const ip = headers.get("x-real-ip") || headers.get("x-forwarded-for") || (connInfo.remoteAddr as Deno.NetAddr).hostname;
  console.log(ip);
  console.log(headers.get("user-agent"));
  return new Response(null, {
    status: 302,
    headers: new Headers({
      "Location": "https://example.com",
    })
  });
}
await serve(handler, { port: 8080 });