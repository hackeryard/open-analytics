import { NextResponse } from "next/server";

export function getCorsHeaders(req?: Request | null): Record<string, string> {
  const origin = req?.headers?.get("origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-API-Key, X-Project-ID, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function handleCorsPreflight(req?: Request | null): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(req),
  });
}

export function corsJsonResponse(
  data: any,
  init?: { status?: number; headers?: HeadersInit },
  req?: Request | null
): NextResponse {
  const corsHeaders = getCorsHeaders(req);
  return NextResponse.json(data, {
    status: init?.status ?? 200,
    headers: {
      ...corsHeaders,
      ...(init?.headers || {}),
    },
  });
}
