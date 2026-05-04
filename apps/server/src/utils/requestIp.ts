import type { Request } from "express";

function normalizeIpValue(value: string): string {
  const trimmed = value.trim();

  if (trimmed.startsWith("::ffff:")) {
    return trimmed.slice(7);
  }

  return trimmed;
}

function readHeaderValue(headers: Request["headers"], name: string): string | undefined {
  const value = headers[name];

  if (Array.isArray(value)) return value[0];
  if (typeof value === "string") return value;

  return undefined;
}

export function getRequestIpDetails(req: Request) {
  const forwardedFor = readHeaderValue(req.headers, "x-forwarded-for");
  const realIp = readHeaderValue(req.headers, "x-real-ip");
  const clientIpHeader = readHeaderValue(req.headers, "x-client-ip");
  const cfConnectingIp = readHeaderValue(req.headers, "cf-connecting-ip");
  const remoteAddress = req.socket.remoteAddress || undefined;

  const forwardedForCandidate = forwardedFor?.split(",")[0]?.trim();

  const requestIp =
    typeof req.ip === "string" && req.ip.length > 0 ? normalizeIpValue(req.ip) : undefined;

  const socketIp = remoteAddress ? normalizeIpValue(remoteAddress) : undefined;

  const resolvedIp =
    requestIp ||
    (clientIpHeader ? normalizeIpValue(clientIpHeader) : undefined) ||
    (forwardedForCandidate ? normalizeIpValue(forwardedForCandidate) : undefined) ||
    (realIp ? normalizeIpValue(realIp) : undefined) ||
    (cfConnectingIp ? normalizeIpValue(cfConnectingIp) : undefined) ||
    socketIp ||
    "unknown";

  return {
    requestIp: requestIp || "unknown",
    resolvedIp,
    socketIp: socketIp || "unknown",
    forwardedFor: forwardedFor || "unknown",
    forwardedForCandidate: forwardedForCandidate || "unknown",
    realIp: realIp || "unknown",
    clientIpHeader: clientIpHeader || "unknown",
    cfConnectingIp: cfConnectingIp || "unknown",
  };
}
