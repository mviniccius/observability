// Popula o banco com alunos de exemplo
// Uso: node scripts/seed.js [URL_DA_API]
// Exemplo: node scripts/seed.js http://174.138.34.172:3000

const API_URL = process.argv[2] || 'http://localhost:3000';

const alunos = [
  { nome: 'Ana Clara Souza',      data_nascimento: '2001-03-15', cpf: '111.222.333-01', telefone: '31988881001', email: 'ana.clara@email.com',   logradouro: 'Rua das Flores',    numero: '10',  bairro: 'Centro',        cidade: 'Belo Horizonte', estado: 'MG', cep: '30100-000' },
  { nome: 'Bruno Lima Santos',    data_nascimento: '2000-07-22', cpf: '111.222.333-02', telefone: '31988881002', email: 'bruno.lima@email.com',   logradouro: 'Av. Afonso Pena',   numero: '200', bairro: 'Funcionários',  cidade: 'Belo Horizonte', estado: 'MG', cep: '30130-000' },
  { nome: 'Carla Mendes Ribeiro', data_nascimento: '1999-11-08', cpf: '111.222.333-03', telefone: '31988881003', email: 'carla.mendes@email.com', logradouro: 'Rua da Bahia',      numero: '350', bairro: 'Lourdes',       cidade: 'Belo Horizonte', estado: 'MG', cep: '30160-000' },
  { nome: 'Diego Alves Pereira',  data_nascimento: '2002-01-30', cpf: '111.222.333-04', telefone: '31988881004', email: 'diego.alves@email.com',  logradouro: 'Rua Espírito Santo', numero: '45', bairro: 'Santa Efigênia', cidade: 'Belo Horizonte', estado: 'MG', cep: '30260-000' },
  { nome: 'Elena Costa Ferreira', data_nascimento: '2001-09-14', cpf: '111.222.333-05', telefone: '31988881005', email: 'elena.costa@email.com',  logradouro: 'Av. Raja Gabaglia',  numero: '600', bairro: 'Gutierrez',    cidade: 'Belo Horizonte', estado: 'MG', cep: '30441-000' },
  { nome: 'Felipe Torres Gomes',  data_nascimento: '2000-04-02', cpf: '111.222.333-06', telefone: '31988881006', email: 'felipe.torres@email.com', logradouro: 'Rua Claudio Manoel', numero: '88', bairro: 'Savassi',      cidade: 'Belo Horizonte', estado: 'MG', cep: '30140-100' },
  { nome: 'Gabriela Nunes Silva', data_nascimento: '2003-06-18', cpf: '111.222.333-07', telefone: '31988881007', email: 'gabriela.nunes@email.com', logradouro: 'Rua Curitiba',   numero: '720', bairro: 'Centro',        cidade: 'Belo Horizonte', estado: 'MG', cep: '30170-120' },
  { nome: 'Henrique Moura Leal',  data_nascimento: '1998-12-25', cpf: '111.222.333-08', telefone: '31988881008', email: 'henrique.moura@email.com', logradouro: 'Av. Amazonas',  numero: '1500', bairro: 'Nova Gameleira', cidade: 'Belo Horizonte', estado: 'MG', cep: '30182-000' },
  { nome: 'Isabela Rocha Dias',   data_nascimento: '2002-08-09', cpf: '111.222.333-09', telefone: '31988881009', email: 'isabela.rocha@email.com', logradouro: 'Rua Padre Eustáquio', numero: '300', bairro: 'Padre Eustáquio', cidade: 'Belo Horizonte', estado: 'MG', cep: '30720-000' },
  { nome: 'João Pedro Martins',   data_nascimento: '2001-02-14', cpf: '111.222.333-10', telefone: '31988881010', email: 'joao.pedro@email.com',   logradouro: 'Rua Sergipe',       numero: '412', bairro: 'Funcionários',  cidade: 'Belo Horizonte', estado: 'MG', cep: '30130-170' },
];

async function seed() {
  console.log(`\n🌱 Populando banco em ${API_URL}...\n`);
  let criados = 0;
  let ignorados = 0;

  for (const aluno of alunos) {
    try {
      const res = await fetch(`${API_URL}/api/alunos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aluno),
      });
      if (res.status === 201) {
        console.log(`  ✓ Criado: ${aluno.nome}`);
        criados++;
      } else if (res.status === 409) {
        console.log(`  · Ignorado (já existe): ${aluno.nome}`);
        ignorados++;
      } else {
        const err = await res.json();
        console.log(`  ✗ Erro ao criar ${aluno.nome}: ${err.error}`);
      }
    } catch (err) {
      console.error(`  ✗ Falha de conexão: ${err.message}`);
      process.exit(1);
    }
  }

  console.log(`\n✅ Seed concluído — ${criados} criados, ${ignorados} já existiam.\n`);
}

seed();
