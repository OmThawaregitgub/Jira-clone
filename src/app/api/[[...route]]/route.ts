/*
 * Optional Next.js API adapter: copy this file over
 * src/app/api/[[...route]]/route.ts in the upstream frontend repository.
 * It forwards /api/* to Django while leaving the React UI, styles, and UI hooks
 * in place. Keep DJANGO_API_BASE_URL server-only (do not prefix NEXT_PUBLIC_).
 */
export type AppType = any;

const DJANGO_API_BASE_URL = process.env.DJANGO_API_BASE_URL ?? "http://127.0.0.1:8000";

async function proxy(request: Request): Promise<Response> {
  const incoming = new URL(request.url);
  const upstreamUrl = `${DJANGO_API_BASE_URL.replace(/\/$/, "")}${incoming.pathname}${incoming.search}`;
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
    cache: "no-store",
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(upstreamUrl, init);
  const responseHeaders = new Headers(upstream.headers);
  // The body is streamed from Django; these headers must be recalculated by Next.
  responseHeaders.delete("content-length");
  responseHeaders.delete("content-encoding");
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
