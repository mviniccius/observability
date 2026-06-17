const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://localhost:9090';

type Context = { params: { path: string[] } };

async function proxy(request: Request, context: Context) {
  const path = context.params.path.join('/');
  const { search } = new URL(request.url);
  const url = `${PROMETHEUS_URL}/${path}${search}`;

  try {
    const res = await fetch(url);
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json(
      { error: 'Prometheus proxy error', detail: message, target: url },
      { status: 502 }
    );
  }
}

export const GET = proxy;
