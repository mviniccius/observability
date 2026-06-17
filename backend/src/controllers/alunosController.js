const pool = require('../database/db');
const { logger } = require('../middleware/logger');

const list = async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM alunos ORDER BY nome ASC';
    let params = [];
    if (search) {
      query = `SELECT * FROM alunos
               WHERE nome ILIKE $1 OR cpf LIKE $1 OR email ILIKE $1
               ORDER BY nome ASC`;
      params = [`%${search}%`];
    }
    const { rows } = await pool.query(query, params);
    return res.json(rows);
  } catch (err) {
    logger.error({ message: 'Erro ao listar alunos', error: err.message });
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const findById = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM alunos WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Aluno não encontrado' });
    return res.json(rows[0]);
  } catch (err) {
    logger.error({ message: 'Erro ao buscar aluno', error: err.message });
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const create = async (req, res) => {
  const { nome, data_nascimento, cpf, telefone, email, logradouro, numero, complemento, bairro, cidade, estado, cep } = req.body;
  if (!nome || !data_nascimento || !cpf || !email) {
    return res.status(400).json({ error: 'nome, data_nascimento, cpf e email são obrigatórios' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO alunos
         (nome, data_nascimento, cpf, telefone, email, logradouro, numero, complemento, bairro, cidade, estado, cep)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [nome, data_nascimento, cpf, telefone, email, logradouro, numero, complemento, bairro, cidade, estado, cep]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'CPF ou e-mail já cadastrado' });
    logger.error({ message: 'Erro ao criar aluno', error: err.message });
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const update = async (req, res) => {
  const { nome, data_nascimento, cpf, telefone, email, logradouro, numero, complemento, bairro, cidade, estado, cep } = req.body;
  if (!nome || !data_nascimento || !cpf || !email) {
    return res.status(400).json({ error: 'nome, data_nascimento, cpf e email são obrigatórios' });
  }
  try {
    const { rows } = await pool.query(
      `UPDATE alunos
       SET nome=$1, data_nascimento=$2, cpf=$3, telefone=$4, email=$5,
           logradouro=$6, numero=$7, complemento=$8, bairro=$9, cidade=$10, estado=$11, cep=$12,
           updated_at=NOW()
       WHERE id=$13
       RETURNING *`,
      [nome, data_nascimento, cpf, telefone, email, logradouro, numero, complemento, bairro, cidade, estado, cep, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Aluno não encontrado' });
    return res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'CPF ou e-mail já cadastrado' });
    logger.error({ message: 'Erro ao atualizar aluno', error: err.message });
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const patch = async (req, res) => {
  const allowed = ['nome','data_nascimento','cpf','telefone','email','logradouro','numero','complemento','bairro','cidade','estado','cep'];
  const fields = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  const keys = Object.keys(fields);
  if (keys.length === 0) return res.status(400).json({ error: 'Nenhum campo válido para atualizar' });

  const setClause = keys.map((k, i) => `${k}=$${i + 1}`).join(', ');
  const values = [...keys.map(k => fields[k]), req.params.id];

  try {
    const { rows } = await pool.query(
      `UPDATE alunos SET ${setClause}, updated_at=NOW() WHERE id=$${values.length} RETURNING *`,
      values
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Aluno não encontrado' });
    return res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'CPF ou e-mail já cadastrado' });
    logger.error({ message: 'Erro ao atualizar parcialmente aluno', error: err.message });
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const remove = async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM alunos WHERE id=$1 RETURNING id', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Aluno não encontrado' });
    return res.status(204).send();
  } catch (err) {
    logger.error({ message: 'Erro ao remover aluno', error: err.message });
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = { list, findById, create, update, patch, remove };
