'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const DROPLET_IP = process.env.NEXT_PUBLIC_GRAFANA_URL || 'http://SEU_DROPLET_IP:3001';

// ── Slides ──────────────────────────────────────────────────────────────────

const slides = [
  // 1 — Capa
  {
    id: 1,
    content: (
      <div className="flex flex-col h-full">
        <div className="bg-blue-600 px-16 py-8 flex items-center justify-between flex-shrink-0">
          <p className="text-blue-100 text-lg font-medium">Pontifícia Universidade Católica de Minas Gerais</p>
          <p className="text-blue-200 text-base">Arquitetura de Software · 5º Período</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-16 py-8">
          <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-6">
            Trabalho Prático — 25 pontos
          </p>
          <h1 className="text-slate-900 text-6xl font-bold leading-tight mb-4">
            Monitoramento e<br />Observabilidade de APIs
          </h1>
          <p className="text-slate-500 text-xl mt-4">Prof. Filipe Tório Lopes Ruas Nhimi</p>
          <div className="mt-10 flex gap-3 flex-wrap justify-center">
            {['Node.js', 'PostgreSQL', 'Prometheus', 'Grafana', 'Next.js', 'Vercel'].map(t => (
              <span key={t} className="px-4 py-1.5 bg-blue-100 border border-blue-300 rounded-full text-blue-700 text-base font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="h-1 bg-blue-600 flex-shrink-0" />
      </div>
    ),
  },

  // 2 — Objetivo
  {
    id: 2,
    content: (
      <div className="flex flex-col justify-center h-full px-16 py-8">
        <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-3">Objetivo</p>
        <h2 className="text-slate-900 text-5xl font-bold mb-8">O que o trabalho avalia?</h2>
        <div className="space-y-3 max-w-3xl">
          {[
            ['Monitorar',    'Acompanhar o comportamento do sistema em tempo real'],
            ['Analisar',     'Coletar e interpretar métricas operacionais da API'],
            ['Identificar',  'Detectar gargalos e picos de uso'],
            ['Desempenho',   'Compreender características de performance sob carga'],
            ['Arquitetura',  'Demonstrar decisões com linguagem técnica adequada'],
          ].map(([title, desc]) => (
            <div key={String(title)} className="flex items-center gap-5 bg-blue-50 border border-blue-200 rounded-xl px-6 py-4">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0" />
              <p className="text-slate-900 font-bold text-xl w-36 flex-shrink-0">{String(title)}</p>
              <p className="text-slate-600 text-xl">{String(desc)}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 3 — Cenário
  {
    id: 3,
    content: (
      <div className="flex flex-col justify-center h-full px-16 py-8">
        <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-3">Cenário</p>
        <h2 className="text-slate-900 text-5xl font-bold mb-5">Plataforma Acadêmica</h2>
        <p className="text-slate-600 text-xl mb-8 max-w-2xl leading-relaxed">
          Microsserviço responsável pelo{' '}
          <strong className="text-slate-900">gerenciamento de alunos</strong>,{' '}
          permitindo operações completas de cadastro e consulta via API RESTful.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 max-w-2xl">
          <p className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-4">Campos da Entidade Aluno</p>
          <div className="grid grid-cols-3 gap-y-2 gap-x-4">
            {['id', 'nome', 'data_nascimento', 'cpf', 'telefone', 'email',
              'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'estado', 'cep'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                <code className="text-blue-700 text-base font-mono">{f}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  // 4 — Arquitetura
  {
    id: 4,
    content: (
      <div className="flex flex-col justify-center h-full px-16 py-8">
        <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-3">Solução</p>
        <h2 className="text-slate-900 text-5xl font-bold mb-8">Arquitetura da Solução</h2>

        {/* Fluxo principal */}
        <div className="flex items-center gap-3 flex-wrap mb-8">
          <div className="bg-slate-100 border border-slate-300 rounded-xl px-5 py-3 text-center">
            <p className="text-slate-800 font-bold text-lg">Browser</p>
            <p className="text-slate-500 text-sm">Usuário</p>
          </div>
          <span className="text-slate-400 text-3xl font-light">→</span>
          <div className="bg-violet-50 border border-violet-300 rounded-xl px-5 py-3 text-center">
            <p className="text-violet-800 font-bold text-lg">Vercel</p>
            <p className="text-violet-500 text-sm">Next.js (HTTPS)</p>
          </div>
          <span className="text-slate-400 text-3xl font-light">→</span>
          <div className="bg-blue-50 border border-blue-300 rounded-xl px-5 py-3 text-center">
            <p className="text-blue-800 font-bold text-lg">Digital Ocean</p>
            <p className="text-blue-500 text-sm">Node.js + PM2</p>
          </div>
          <span className="text-slate-400 text-3xl font-light">↔</span>
          <div className="bg-teal-50 border border-teal-300 rounded-xl px-5 py-3 text-center">
            <p className="text-teal-800 font-bold text-lg">PostgreSQL</p>
            <p className="text-teal-500 text-sm">Docker</p>
          </div>
        </div>

        {/* Stack de observabilidade */}
        <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-3">Observabilidade</p>
        <div className="flex gap-4 flex-wrap">
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-3">
            <p className="text-orange-800 font-bold text-lg">Prometheus</p>
            <p className="text-orange-500 text-sm mt-0.5">Coleta métricas a cada 10s</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3">
            <p className="text-yellow-800 font-bold text-lg">Grafana</p>
            <p className="text-yellow-600 text-sm mt-0.5">Dashboards em tempo real</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3">
            <p className="text-green-800 font-bold text-lg">Winston</p>
            <p className="text-green-600 text-sm mt-0.5">Logs estruturados em JSON</p>
          </div>
        </div>
      </div>
    ),
  },

  // 5 — API REST
  {
    id: 5,
    content: (
      <div className="flex flex-col justify-center h-full px-16 py-8">
        <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-3">Implementação</p>
        <h2 className="text-slate-900 text-5xl font-bold mb-7">API RESTful — Endpoints</h2>
        <div className="space-y-2 max-w-2xl">
          {[
            { method: 'GET',    bg: 'bg-green-100 text-green-800',   path: '/api/alunos',     desc: 'Listar todos (busca opcional)' },
            { method: 'GET',    bg: 'bg-green-100 text-green-800',   path: '/api/alunos/:id', desc: 'Buscar aluno por ID' },
            { method: 'POST',   bg: 'bg-blue-100 text-blue-800',     path: '/api/alunos',     desc: 'Cadastrar novo aluno' },
            { method: 'PUT',    bg: 'bg-yellow-100 text-yellow-800', path: '/api/alunos/:id', desc: 'Atualizar todos os campos' },
            { method: 'PATCH',  bg: 'bg-orange-100 text-orange-800', path: '/api/alunos/:id', desc: 'Atualizar campos específicos' },
            { method: 'DELETE', bg: 'bg-red-100 text-red-800',       path: '/api/alunos/:id', desc: 'Remover aluno' },
          ].map(({ method, bg, path, desc }) => (
            <div key={method + path} className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3">
              <span className={`${bg} font-mono font-bold text-sm px-2.5 py-1 rounded-lg w-20 text-center flex-shrink-0`}>{method}</span>
              <code className="text-slate-800 text-base flex-1 font-mono">{path}</code>
              <span className="text-slate-500 text-base">{desc}</span>
            </div>
          ))}
        </div>
        <p className="text-slate-400 text-base mt-5">
          +{' '}
          <code className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono">GET /metrics</code>
          {' '}— Prometheus{' · '}
          <code className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono">GET /health</code>
          {' '}— health check
        </p>
      </div>
    ),
  },

  // 6 — Stack de Observabilidade
  {
    id: 6,
    content: (
      <div className="flex flex-col justify-center h-full px-16 py-8">
        <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-3">Observabilidade</p>
        <h2 className="text-slate-900 text-5xl font-bold mb-8">Como funciona?</h2>
        <div className="flex gap-10 items-start max-w-4xl flex-wrap">
          {/* Fluxo */}
          <div className="flex-1 min-w-56 space-y-4">
            <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-2">Fluxo das métricas</p>
            {[
              ['API recebe requisição',      'Middleware registra método, rota, status, duração'],
              ['prom-client expõe /metrics', 'Contadores e histogramas em formato Prometheus'],
              ['Prometheus faz scrape',      'Coleta automaticamente a cada 10 segundos'],
              ['Grafana consulta',           'Queries PromQL nos dashboards em tempo real'],
            ].map(([title, desc], n) => (
              <div key={String(title)} className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center flex-shrink-0 font-bold">{n + 1}</span>
                <div>
                  <p className="text-slate-900 text-lg font-semibold">{String(title)}</p>
                  <p className="text-slate-500 text-base">{String(desc)}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Log sample */}
          <div className="flex-1 min-w-56 bg-slate-900 rounded-2xl p-5">
            <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-3">Log estruturado (Winston)</p>
            <pre className="text-green-400 text-sm leading-relaxed">{`{
  "type": "http_request",
  "method": "POST",
  "url": "/api/alunos",
  "status": 201,
  "duration_ms": 45,
  "ip": "::1"
}`}</pre>
          </div>
        </div>
      </div>
    ),
  },

  // 7 — Métricas Obrigatórias
  {
    id: 7,
    content: (
      <div className="flex flex-col justify-center h-full px-16 py-8">
        <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-3">Requisito Principal</p>
        <h2 className="text-slate-900 text-5xl font-bold mb-8">Métricas Implementadas</h2>
        <div className="grid grid-cols-2 gap-3 max-w-3xl">
          {[
            { metric: 'RPS',                   query: 'rate(http_requests_total[1m])' },
            { metric: 'Tempo médio resposta',   query: 'histogram_sum / histogram_count' },
            { metric: 'Tempo máximo (p99)',      query: 'histogram_quantile(0.99, ...)' },
            { metric: 'Total de requisições',   query: 'http_requests_total' },
            { metric: 'Percentual de erros',    query: 'http_errors_total / http_requests_total' },
            { metric: 'Códigos HTTP',           query: 'label: status_code' },
            { metric: 'Uso de CPU',             query: 'api_process_cpu_seconds_total' },
            { metric: 'Logs estruturados',      query: 'Winston JSON — arquivo + console' },
          ].map(({ metric, query }) => (
            <div key={metric} className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <span className="text-green-600 text-xl font-bold flex-shrink-0 mt-0.5">✓</span>
              <div>
                <p className="text-slate-900 text-lg font-semibold">{metric}</p>
                <code className="text-slate-500 text-sm font-mono">{query}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 8 — Dashboard
  {
    id: 8,
    content: (
      <div className="flex flex-col justify-center h-full px-16 py-8">
        <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-3">Demo</p>
        <h2 className="text-slate-900 text-5xl font-bold mb-6">Dashboard ao Vivo</h2>
        <div className="grid grid-cols-3 gap-4 max-w-2xl mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-blue-700 text-3xl font-bold">~3 req/s</p>
            <p className="text-blue-500 text-base mt-1">RPS</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <p className="text-green-700 text-3xl font-bold">{'< 50ms'}</p>
            <p className="text-green-500 text-base mt-1">Latência média</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
            <p className="text-orange-700 text-3xl font-bold">~15%</p>
            <p className="text-orange-500 text-base mt-1">Erros 4xx/5xx</p>
          </div>
        </div>
        <a
          href={`${DROPLET_IP}/d/observability-api/observabilidade-da-api?orgId=1&from=now-1h&to=now&refresh=10s`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-colors cursor-pointer w-fit text-lg"
        >
          Abrir Dashboard Grafana →
        </a>
        <p className="text-slate-400 text-base mt-4">
          Rode{' '}
          <code className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-mono text-sm">
            node scripts/load.js {'<'}API_URL{'>'} 300
          </code>
          {' '}para gerar tráfego durante a apresentação
        </p>
      </div>
    ),
  },

  // 9 — Critérios de Avaliação
  {
    id: 9,
    content: (
      <div className="flex flex-col justify-center h-full px-16 py-8">
        <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-3">Avaliação</p>
        <h2 className="text-slate-900 text-5xl font-bold mb-8">Critérios Atendidos</h2>
        <div className="space-y-3 max-w-2xl">
          {[
            'Comunicação e clareza na apresentação da solução',
            'Cumprimento dos requisitos técnicos especificados',
            'Apresentação dos detalhes arquiteturais com linguagem técnica',
            'Qualidade da implementação',
            'Capacidade de demonstrar e justificar decisões arquiteturais',
            'Funcionamento da solução durante a apresentação',
            'Qualidade da estratégia de observabilidade e monitoramento',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <span className="text-slate-700 text-xl">{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 10 — Fim
  {
    id: 10,
    content: (
      <div className="flex flex-col h-full">
        <div className="bg-blue-600 px-16 py-8 flex-shrink-0">
          <p className="text-blue-100 text-base">Pontifícia Universidade Católica de Minas Gerais — 2026</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-12 py-8">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
            <span className="text-white text-4xl">✓</span>
          </div>
          <h2 className="text-slate-900 text-7xl font-bold mb-4">Obrigado!</h2>
          <p className="text-slate-500 text-2xl mb-10">Dúvidas?</p>
          <div className="flex gap-6 text-lg text-slate-500 flex-wrap justify-center">
            <span>
              API:{' '}
              <code className="text-slate-700 bg-slate-100 px-3 py-1 rounded-lg font-mono text-base">
                174.138.34.172:3000
              </code>
            </span>
            <span>
              Grafana:{' '}
              <code className="text-slate-700 bg-slate-100 px-3 py-1 rounded-lg font-mono text-base">
                174.138.34.172:3001
              </code>
            </span>
          </div>
        </div>
        <div className="h-1 bg-blue-600 flex-shrink-0" />
      </div>
    ),
  },
];

// ── Componente ────────────────────────────────────────────────────────────────

export default function ApresentacaoPage() {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent(c => Math.min(slides.length - 1, c + 1)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  const slide = slides[current];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Conteúdo do slide */}
      <div className="flex-1 overflow-hidden">
        {slide.content}
      </div>

      {/* Barra de navegação — tema claro */}
      <div className="flex items-center justify-between px-8 py-4 bg-white border-t border-slate-200 flex-shrink-0">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          Fechar
        </button>

        {/* Progress dots */}
        <div className="flex gap-2 items-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                i === current ? 'bg-blue-600 w-6' : 'bg-slate-300 hover:bg-slate-400 w-2'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm">{current + 1} / {slides.length}</span>
          <button
            onClick={prev}
            disabled={current === 0}
            className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-slate-700" />
          </button>
          <button
            onClick={next}
            disabled={current === slides.length - 1}
            className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
