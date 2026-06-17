CREATE TABLE IF NOT EXISTS alunos (
  id              SERIAL PRIMARY KEY,
  nome            VARCHAR(255) NOT NULL,
  data_nascimento DATE NOT NULL,
  cpf             VARCHAR(14)  UNIQUE NOT NULL,
  telefone        VARCHAR(20),
  email           VARCHAR(255) UNIQUE NOT NULL,
  logradouro      VARCHAR(255),
  numero          VARCHAR(20),
  complemento     VARCHAR(100),
  bairro          VARCHAR(100),
  cidade          VARCHAR(100),
  estado          CHAR(2),
  cep             VARCHAR(9),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
