'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const DROPLET_IP = process.env.NEXT_PUBLIC_GRAFANA_URL || 'http://SEU_DROPLET_IP:3001';

const slides = [
  // 1 — Capa
  {
    id: 1,
    bg: 'from-slate-900 to-blue-950',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-12">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-6">
          Pontifícia Universidade Católica de Minas Gerais
        </p>
        <h1 className="text-5xl font-bold text-white leading-tight mb-4">
          Monitoramento e<br />Observabilidade de APIs
        </h1>
        <p className="text-slate-400 text-lg mt-4">Arquitetura de Software — 5º Período</p>
        <p className="text-slate-500 text-sm mt-2">Prof. Filipe Tório Lopes Ruas Nhimi</p>
        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          {['Node.js', 'PostgreSQL', 'Prometheus', 'Grafana', 'Next.js', 'Vercel'].map(t => (
            <span key={t} className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm">
              {t}
            </span>
          ))}
        </div>
      </div>
    ),
  },

  // 2 — Objetivo
  {
    id: 2,
    bg: 'from-slate-900 to-slate-800',
    content: (
      <div className="flex flex-col justify-center h-full px-16">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Objetivo</p>
        <h2 className="text-4xl font-bold text-white mb-8">O que o trabalho avalia?</h2>
        <div className="grid grid-cols-1 gap-4 max-w-3xl">
          {[
            ['📡', 'Monitorar', 'Acompanhar o comportamento do sistema em tempo real'],
            ['📊', 'Analisar', 'Coletar e interpretar métricas operacionais da API'],
            ['🔍', 'Identificar', 'Detectar gargalos e picos de uso'],
            ['⚡', 'Desempenho', 'Compreender características de performance sob carga'],
            ['🏗️', 'Arquitetura', 'Demonstrar decisões arquiteturais com linguagem técnica'],
          ].map(([icon, title, desc]) => (
            <div key={String(title)} className="flex items-start gap-4 bg-slate-800/60 rounded-xl px-5 py-4 border border-slate-700">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-white font-semibold">{String(title)}</p>
                <p className="text-slate-400 text-sm mt-0.5">{String(desc)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 3 — Cenário
  {
    id: 3,
    bg: 'from-slate-900 to-slate-800',
    content: (
      <div className="flex flex-col justify-center h-full px-16">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Cenário</p>
        <h2 className="text-4xl font-bold text-white mb-6">Plataforma Acadêmica</h2>
        <p className="text-slate-300 text-lg mb-8 max-w-2xl">
          Microsserviço responsável pelo <strong className="text-white">gerenciamento de alunos</strong>, permitindo operações completas de cadastro e consulta via API RESTful.
        </p>
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 max-w-2xl">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">Entidade Aluno</p>
          <div className="grid grid-cols-2 gap-2">
            {['id', 'nome', 'data_nascimento', 'cpf', 'telefone', 'email', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'estado', 'cep'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                <code className="text-blue-300 text-sm">{f}</code>
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
    bg: 'from-slate-900 to-slate-800',
    content: (
      <div className="flex flex-col justify-center h-full px-16">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Solução</p>
        <h2 className="text-4xl font-bold text-white mb-8">Arquitetura da Solução</h2>
        <div className="flex items-center gap-4 flex-wrap">
          {[
            { label: 'Browser', sub: 'Usuário', color: 'slate' },
            { label: '→', sub: '', color: 'none' },
            { label: 'Vercel', sub: 'Next.js (HTTPS)', color: 'violet' },
            { label: '→', sub: '', color: 'none' },
            { label: 'Digital Ocean', sub: 'Node.js + PM2', color: 'blue' },
            { label: '↔', sub: '', color: 'none' },
            { label: 'PostgreSQL', sub: 'Docker', color: 'teal' },
          ].map((item, i) =>
            item.color === 'none' ? (
              <span key={i} className="text-slate-500 text-2xl font-light">{item.label}</span>
            ) : (
              <div key={i} className={`bg-${item.color}-900/40 border border-${item.color}-700/50 rounded-xl px-5 py-3 text-center`}>
                <p className={`text-${item.color}-300 font-semibold`}>{item.label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{item.sub}</p>
              </div>
            )
          )}
        </div>
        <div className="mt-8 flex gap-4 flex-wrap">
          {[
            { label: 'Prometheus', sub: 'Coleta métricas a cada 10s', color: 'orange' },
            { label: 'Grafana', sub: 'Dashboards em tempo real', color: 'yellow' },
            { label: 'Winston', sub: 'Logs estruturados em JSON', color: 'green' },
          ].map(item => (
            <div key={item.label} className={`bg-${item.color}-900/30 border border-${item.color}-700/40 rounded-xl px-5 py-3`}>
              <p className={`text-${item.color}-300 font-semibold`}>{item.label}</p>
              <p className="text-slate-500 text-xs mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 5 — API REST
  {
    id: 5,
    bg: 'from-slate-900 to-slate-800',
    content: (
      <div className="flex flex-col justify-center h-full px-16">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Implementação</p>
        <h2 className="text-4xl font-bold text-white mb-8">API RESTful — Endpoints</h2>
        <div className="space-y-3 max-w-2xl">
          {[
            { method: 'GET',    color: 'green',  path: '/api/alunos',      desc: 'Listar todos os alunos (com busca opcional)' },
            { method: 'GET',    color: 'green',  path: '/api/alunos/:id',  desc: 'Buscar aluno por ID' },
            { method: 'POST',   color: 'blue',   path: '/api/alunos',      desc: 'Cadastrar novo aluno' },
            { method: 'PUT',    color: 'yellow', path: '/api/alunos/:id',  desc: 'Atualizar todos os campos do aluno' },
            { method: 'PATCH',  color: 'orange', path: '/api/alunos/:id',  desc: 'Atualizar campos específicos' },
            { method: 'DELETE', color: 'red',    path: '/api/alunos/:id',  desc: 'Remover aluno' },
          ].map(({ method, color, path, desc }) => (
            <div key={method + path} className="flex items-center gap-4 bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-3">
              <span className={`text-${color}-400 font-mono font-bold text-sm w-16 flex-shrink-0`}>{method}</span>
              <code className="text-slate-300 text-sm flex-1">{path}</code>
              <span className="text-slate-500 text-sm">{desc}</span>
            </div>
          ))}
        </div>
        <p className="text-slate-500 text-sm mt-6">+ <code className="text-slate-400">GET /metrics</code> — endpoint Prometheus | <code className="text-slate-400">GET /health</code> — health check</p>
      </div>
    ),
  },

  // 6 — Stack de Observabilidade
  {
    id: 6,
    bg: 'from-slate-900 to-orange-950',
    content: (
      <div className="flex flex-col justify-center h-full px-16">
        <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-3">Observabilidade</p>
        <h2 className="text-4xl font-bold text-white mb-8">Como funciona?</h2>
        <div className="flex gap-6 items-start max-w-4xl flex-wrap">
          <div className="flex-1 min-w-48 space-y-3">
            <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Fluxo das métricas</p>
            {[
              ['1', 'API recebe requisição', 'Middleware registra método, rota, status, duração'],
              ['2', 'prom-client expõe /metrics', 'Contadores e histogramas em formato Prometheus'],
              ['3', 'Prometheus faz scrape', 'Coleta a cada 10 segundos'],
              ['4', 'Grafana consulta', 'Queries PromQL nos dashboards'],
            ].map(([n, title, desc]) => (
              <div key={String(n)} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">{n}</span>
                <div>
                  <p className="text-white text-sm font-medium">{String(title)}</p>
                  <p className="text-slate-500 text-xs">{String(desc)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex-1 min-w-48 bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-3">Logs estruturados (Winston)</p>
            <pre className="text-green-400 text-xs leading-relaxed overflow-auto">{`{
  "type": "http_request",
  "method": "POST",
  "url": "/api/alunos",
  "status": 201,
  "duration_ms": 45,
  "ip": "::1",
  "timestamp": "2026-06-17T..."
}`}</pre>
          </div>
        </div>
      </div>
    ),
  },

  // 7 — Métricas Obrigatórias
  {
    id: 7,
    bg: 'from-slate-900 to-slate-800',
    content: (
      <div className="flex flex-col justify-center h-full px-16">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Requisito Principal</p>
        <h2 className="text-4xl font-bold text-white mb-8">Métricas Implementadas</h2>
        <div className="grid grid-cols-2 gap-3 max-w-3xl">
          {[
            { metric: 'RPS',                   query: 'rate(http_requests_total[1m])',           ok: true },
            { metric: 'Tempo médio resposta',   query: 'histogram_sum / histogram_count',        ok: true },
            { metric: 'Tempo máximo (p99)',      query: 'histogram_quantile(0.99, ...)',           ok: true },
            { metric: 'Total de requisições',   query: 'http_requests_total',                    ok: true },
            { metric: 'Percentual de erros',    query: 'http_errors_total / http_requests_total',ok: true },
            { metric: 'Códigos HTTP',           query: 'label: status_code',                     ok: true },
            { metric: 'Uso de CPU',             query: 'api_process_cpu_seconds_total',           ok: true },
            { metric: 'Logs estruturados',      query: 'Winston JSON — arquivo + console',        ok: true },
          ].map(({ metric, query, ok }) => (
            <div key={metric} className="flex items-start gap-3 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3">
              <span className={`mt-0.5 text-lg ${ok ? 'text-green-400' : 'text-slate-600'}`}>✓</span>
              <div>
                <p className="text-white text-sm font-semibold">{metric}</p>
                <code className="text-slate-500 text-xs">{query}</code>
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
    bg: 'from-slate-900 to-slate-800',
    content: (
      <div className="flex flex-col justify-center h-full px-16">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Demo</p>
        <h2 className="text-4xl font-bold text-white mb-6">Dashboard Grafana</h2>
        <div className="grid grid-cols-3 gap-4 max-w-3xl mb-6">
          {[
            { label: 'RPS', value: '~3 req/s', color: 'blue' },
            { label: 'Latência média', value: '< 50ms', color: 'green' },
            { label: 'Erros (4xx/5xx)', value: '~15%', color: 'orange' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`bg-${color}-900/30 border border-${color}-700/40 rounded-xl p-4 text-center`}>
              <p className={`text-${color}-300 text-2xl font-bold`}>{value}</p>
              <p className="text-slate-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
        <a
          href={`${DROPLET_IP}/d/observability-api/observabilidade-da-api?orgId=1&from=now-1h&to=now&refresh=10s`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors cursor-pointer w-fit text-sm"
        >
          Abrir Dashboard ao vivo →
        </a>
        <p className="text-slate-600 text-xs mt-3">Rode <code className="text-slate-400">node scripts/load.js &lt;API_URL&gt; 300</code> para gerar tráfego durante a apresentação</p>
      </div>
    ),
  },

  // 9 — Critérios de Avaliação
  {
    id: 9,
    bg: 'from-slate-900 to-slate-800',
    content: (
      <div className="flex flex-col justify-center h-full px-16">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Avaliação</p>
        <h2 className="text-4xl font-bold text-white mb-8">Critérios Atendidos</h2>
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
            <div key={i} className="flex items-center gap-3 bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-3">
              <span className="text-green-400 text-lg">✓</span>
              <span className="text-slate-300 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 10 — Fim
  {
    id: 10,
    bg: 'from-slate-900 to-blue-950',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-12">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8">
          <span className="text-white text-3xl">✓</span>
        </div>
        <h2 className="text-5xl font-bold text-white mb-4">Obrigado!</h2>
        <p className="text-slate-400 text-xl mb-10">Dúvidas?</p>
        <div className="flex gap-6 text-sm text-slate-500">
          <span>API: <code className="text-slate-300">http://174.138.34.172:3000</code></span>
          <span>Grafana: <code className="text-slate-300">http://174.138.34.172:3001</code></span>
        </div>
      </div>
    ),
  },
];

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
    <div className={`fixed inset-0 bg-gradient-to-br ${slide.bg} z-50 flex flex-col transition-all duration-300`}>
      {/* Conteúdo */}
      <div className="flex-1 overflow-hidden">
        {slide.content}
      </div>

      {/* Barra inferior */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-white/10">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          Fechar
        </button>

        {/* Progress dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                i === current ? 'bg-blue-400 w-6' : 'bg-slate-600 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-600 text-sm">{current + 1} / {slides.length}</span>
          <button
            onClick={prev}
            disabled={current === 0}
            className="p-2 rounded-lg border border-slate-700 hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={next}
            disabled={current === slides.length - 1}
            className="p-2 rounded-lg border border-slate-700 hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
