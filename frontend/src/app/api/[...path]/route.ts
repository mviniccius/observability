const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

type Context = { params: { path: string[] } };

async function proxy(request: Request, context: Context) {
  const path = context.params.path.join('/');
  const { search } = new URL(request.url);
  const url = `${BACKEND_URL}/api/${path}${search}`;

  try {
    const init: RequestInit = { method: request.method };
    const body = await request.text();
    if (body) {
      init.body = body;
      init.headers = { 'Content-Type': 'application/json' };
    }

    const res = await fetch(url, init);
    if (res.status === 204) return new Response(null, { status: 204 });

    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json(
      { error: 'Proxy error', detail: message, backend: BACKEND_URL },
      { status: 502 }
    );
  }
}

export const GET    = proxy;
export const POST   = proxy;
export const PUT    = proxy;
export const PATCH  = proxy;
export const DELETE = proxy;
