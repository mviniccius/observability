// Gerador de tráfego para a apresentação
// Uso: node scripts/load.js [URL_DA_API] [DURACAO_SEGUNDOS]
// Exemplo: node scripts/load.js http://174.138.34.172:3000 120

const API_URL = process.argv[2] || 'http://localhost:3000';
const DURACAO  = parseInt(process.argv[3] || '120') * 1000;
const INTERVALO_MS = 300; // uma requisição a cada 300ms (~3 RPS)

let contadores = { total: 0, sucesso: 0, erro: 0 };
let inicio = Date.now();

// ── Helpers ───────────────────────────────────────────────────────────────────

async function req(method, path, body) {
  try {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${API_URL}${path}`, opts);
    contadores.total++;
    if (res.status < 400) contadores.sucesso++;
    else contadores.erro++;
    return { status: res.status, data: res.status !== 204 ? await res.json() : null };
  } catch {
    contadores.erro++;
    contadores.total++;
    return { status: 0, data: null };
  }
}

function cpfAleatorio() {
  const n = () => Math.floor(Math.random() * 900) + 100;
  return `${n()}.${n()}.${n()}-${Math.floor(Math.random() * 90) + 10}`;
}

function emailAleatorio() {
  const nomes = ['pedro','lucas','julia','mariana','rafael','beatriz','thiago','larissa'];
  return `${nomes[Math.floor(Math.random() * nomes.length)]}${Math.floor(Math.random() * 9999)}@teste.com`;
}

// ── Cenários ──────────────────────────────────────────────────────────────────

async function listarAlunos()     { return req('GET',   '/api/alunos'); }
async function buscarInexistente(){ return req('GET',   `/api/alunos/99999`); }          // gera 404
async function bodyInvalido()     { return req('POST',  '/api/alunos', { nome: '' }); }  // gera 400

async function criarAluno() {
  return req('POST', '/api/alunos', {
    nome:            `Aluno Carga ${Math.floor(Math.random() * 1000)}`,
    data_nascimento: '2000-01-01',
    cpf:             cpfAleatorio(),
    telefone:        '31988880000',
    email:           emailAleatorio(),
    logradouro:      'Rua Teste',
    numero:          '1',
    bairro:          'Centro',
    cidade:          'Belo Horizonte',
    estado:          'MG',
    cep:             '30100-000',
  });
}

async function atualizarPrimeiro() {
  const { data } = await req('GET', '/api/alunos');
  if (!data || data.length === 0) return;
  const aluno = data[Math.floor(Math.random() * Math.min(data.length, 5))];
  await req('PATCH', `/api/alunos/${aluno.id}`, { telefone: `319888${Math.floor(Math.random() * 90000) + 10000}` });
}

async function removerCriados() {
  const { data } = await req('GET', '/api/alunos');
  if (!data) return;
  const carga = data.filter(a => a.nome.startsWith('Aluno Carga'));
  if (carga.length > 15) {
    const alvo = carga[Math.floor(Math.random() * carga.length)];
    await req('DELETE', `/api/alunos/${alvo.id}`);
  }
}

// ── Ciclo principal ───────────────────────────────────────────────────────────

// Pesos: define a frequência de cada operação
const cenarios = [
  { fn: listarAlunos,      peso: 40 }, // 40% GET /alunos
  { fn: criarAluno,        peso: 20 }, // 20% POST (cria)
  { fn: atualizarPrimeiro, peso: 15 }, // 15% PATCH
  { fn: removerCriados,    peso: 10 }, // 10% DELETE
  { fn: buscarInexistente, peso: 10 }, // 10% GET 404 (erro proposital)
  { fn: bodyInvalido,      peso: 5  }, // 5%  POST 400 (erro proposital)
];

function sortearCenario() {
  const total = cenarios.reduce((s, c) => s + c.peso, 0);
  let r = Math.random() * total;
  for (const c of cenarios) {
    r -= c.peso;
    if (r <= 0) return c.fn;
  }
  return cenarios[0].fn;
}

function exibirStatus() {
  const elapsed = Math.floor((Date.now() - inicio) / 1000);
  const restante = Math.floor((DURACAO - (Date.now() - inicio)) / 1000);
  const pctErro = contadores.total ? ((contadores.erro / contadores.total) * 100).toFixed(1) : '0.0';
  process.stdout.write(
    `\r  ⏱  ${elapsed}s | Restante: ${restante}s | Requisições: ${contadores.total} | ✓ ${contadores.sucesso} | ✗ ${contadores.erro} (${pctErro}%)   `
  );
}

async function main() {
  console.log(`\n🚀 Iniciando gerador de tráfego`);
  console.log(`   API:      ${API_URL}`);
  console.log(`   Duração:  ${DURACAO / 1000}s`);
  console.log(`   Intervalo: ${INTERVALO_MS}ms (~${Math.round(1000 / INTERVALO_MS)} RPS)\n`);

  const statusInterval = setInterval(exibirStatus, 1000);

  while (Date.now() - inicio < DURACAO) {
    const fn = sortearCenario();
    fn(); // não aguarda — simula requisições paralelas
    await new Promise(r => setTimeout(r, INTERVALO_MS));
  }

  clearInterval(statusInterval);
  exibirStatus();
  console.log(`\n\n✅ Concluído! Total: ${contadores.total} requisições.\n`);
}

main();
