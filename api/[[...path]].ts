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
  headers.delete('connection');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(upstream, {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer(),
      signal: controller.signal,
      redirect: 'follow',
    });
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    const message = error instanceof Error && error.name === 'AbortError'
      ? 'Production API request timed out.'
      : 'Production API is temporarily unavailable.';
    return Response.json({ error: message }, { status: 504 });
  } finally {
    clearTimeout(timeout);
  }
}
