import type { IncomingMessage, ServerResponse } from "node:http";

import { toNodeHandler } from "better-auth/node";

import { auth } from "./auth.js";

const authHandler = toNodeHandler(auth.handler);

function withAuthBasePath(url = "/", mountPath = "/api/auth") {
  const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
  return normalizedUrl.startsWith("/api/auth") ? normalizedUrl : `${mountPath}${normalizedUrl}`;
}

export function createAuthRouteHandler(mountPath = "/api/auth") {
  return function handler(req: IncomingMessage, res: ServerResponse) {
    req.url = withAuthBasePath(req.url, mountPath);
    return authHandler(req, res);
  };
}
