const express = require('express');
const cors = require('cors');
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

app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada' }));

module.exports = app;
