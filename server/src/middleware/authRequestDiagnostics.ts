import { NextFunction, Request, Response } from "express";

import { getRequestIpDetails } from "#utils/requestIp";

export function authRequestDiagnosticsMiddleware(req: Request, _res: Response, next: NextFunction) {
  const ipDetails = getRequestIpDetails(req);

  if (ipDetails.resolvedIp !== "unknown") {
    req.headers["x-client-ip"] = ipDetails.resolvedIp;
  }

  if (!req.headers["x-real-ip"] && ipDetails.resolvedIp !== "unknown") {
    req.headers["x-real-ip"] = ipDetails.resolvedIp;
  }

  next();
}
