-- Muda o tipo de CHAR(2) para VARCHAR(2) para evitar problemas com strings de tamanho diferente
ALTER TABLE alunos ALTER COLUMN estado TYPE VARCHAR(2);
