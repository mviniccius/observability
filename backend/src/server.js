require('dotenv').config();
const fs = require('fs');
const path = require('path');
const app = require('./app');
const pool = require('./database/db');
const { logger } = require('./middleware/logger');

const PORT = process.env.PORT || 3000;

async function initDatabase() {
  const sql = fs.readFileSync(path.join(__dirname, '../sql/init.sql'), 'utf8');
  await pool.query(sql);
  logger.info('Banco de dados inicializado com sucesso');
}

async function start() {
  try {
    await initDatabase();
    app.listen(PORT, '0.0.0.0', () => {
      logger.info({ message: `API rodando`, port: PORT, env: process.env.NODE_ENV || 'development' });
    });
  } catch (err) {
    logger.error({ message: 'Falha ao iniciar o servidor', error: err.message });
    process.exit(1);
  }
}

start();
