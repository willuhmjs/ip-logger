import {
  ConnInfo,
  Handler,
  serve,
} from "https://deno.land/std@0.187.0/http/server.ts";
import isbot from "https://esm.sh/isbot@3.6.10";
import * as Colors from "https://deno.land/std@0.188.0/fmt/colors.ts";

const logIp = async (req: Request, connInfo: ConnInfo) => {
  const ip = req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for") ||
    (connInfo.remoteAddr as Deno.NetAddr).hostname;
  if (!ip) return console.log(Colors.red("REQUEST WITHOUT IP ADDRESS!"));
  let endMessage = "";
  endMessage += "\nIP Address: " + Colors.green(ip);
  endMessage += "\nBot Detected: " + (isbot(req.headers.get("User-Agent") || "") ? Colors.red(`Yes [${req.headers.get("User-Agent")}]`) : Colors.green("No"));
  const ipInfoRaw = await fetch(`https://ipinfo.io/${ip}/json`);
  
  if (!ipInfoRaw.ok) return endMessage;
  const ipInfo = await ipInfoRaw.json();
  endMessage += "\nCountry: " + Colors.blue(ipInfo.country);
  endMessage += "\nRegion: " + Colors.blue(ipInfo.region);
  endMessage += "\nCity: " + Colors.blue(ipInfo.city);
  endMessage += "\nLocation: " + Colors.blue(ipInfo.loc);
  endMessage += "\nOrganization: " + Colors.blue(ipInfo.org);
  endMessage += "\nTimezone: " + Colors.blue(ipInfo.timezone);
  endMessage += "\nPostal: " + Colors.blue(ipInfo.postal);
  return endMessage;
};

const handler: Handler = async (
  req: Request,
  connInfo: ConnInfo,
): Promise<Response> => {
  console.log(await logIp(req, connInfo));
  return new Response(null, {
    status: 302,
    headers: new Headers({
      "Location": "https://example.com",
    }),
  });
};
await serve(handler, { port: 8080 });
