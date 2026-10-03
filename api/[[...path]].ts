const backendOrigin = (process.env.API_ORIGIN || '').replace(/\/$/, '');

export default async function handler(request: Request): Promise<Response> {
  if (!backendOrigin) {
    return Response.json(
      { error: 'Production API origin is not configured.' },
      { status: 503 },
    );
  }

  const incoming = new URL(request.url);
  const upstream = new URL(incoming.pathname.replace(/^\/api/, '') + incoming.search, backendOrigin);

  const headers = new Headers(request.headers);
  headers.delete('host');

  try {
    const response = await fetch(upstream, {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer(),
    });
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch {
    return Response.json(
      { error: 'Production API is temporarily unavailable.' },
      { status: 502 },
    );
  }
}
