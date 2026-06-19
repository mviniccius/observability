const express = require('express');
const cors = require('cors');
const http = require('http');
const { metricsMiddleware, register } = require('./middleware/metrics');
const { requestLogger } = require('./middleware/logger');
const alunosRoutes = require('./routes/alunos');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(metricsMiddleware);

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use('/api/alunos', alunosRoutes);

// Proxy para o Prometheus (acessível apenas localmente no servidor)
const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://localhost:9090';

app.use('/api/prometheus', (req, res) => {
  const target = new URL(req.url, PROMETHEUS_URL);
  const options = {
    hostname: target.hostname,
    port: target.port || 9090,
    path: target.pathname + target.search,
    method: req.method,
    headers: { accept: 'application/json' },
  };
  const proxy = http.request(options, (upstream) => {
    res.status(upstream.statusCode);
    res.set('Content-Type', upstream.headers['content-type'] || 'application/json');
    upstream.pipe(res);
  });
  proxy.on('error', (err) => res.status(502).json({ error: 'Prometheus indisponível', detail: err.message }));
  proxy.end();
});

app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada' }));

module.exports = app;
