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
            Trabalho Prático
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

  // 2 — Objetivos da apresentação (novo)
  {
    id: 2,
    content: (
      <div className="flex flex-col justify-center h-full px-16 py-8">
        <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-3">Roteiro</p>
        <h2 className="text-slate-900 text-5xl font-bold mb-8">Objetivos</h2>
        <div className="grid grid-cols-1 gap-4 max-w-3xl">
          {[
            { num: '1', title: 'Entender o conceito de observabilidade', desc: 'O que é, origem e por que se tornou essencial em sistemas modernos.' },
            { num: '2', title: 'Como funciona na prática', desc: 'Os três pilares (logs, métricas e traces) e a instrumentação sem alterar código.' },
            { num: '3', title: 'Ganhos gerados pela adoção', desc: 'Diagnóstico mais rápido, redução de MTTR, confiabilidade e melhores decisões arquiteturais.' },
            { num: '4', title: 'Exemplo prático com API real', desc: 'Aplicação Node.js com Prometheus + Grafana, demonstrando métricas e dashboards ao vivo.' },
          ].map(({ num, title, desc }) => (
            <div key={num} className="flex items-start gap-4 bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg">{num}</div>
              <div>
                <p className="text-slate-900 font-bold text-lg">{title}</p>
                <p className="text-slate-600 text-base mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 3 — O que é Observabilidade (travessão removido, frase ajustada)
  {
    id: 3,
    content: (
      <div className="flex flex-col justify-center h-full px-16 py-8">

        <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-3">
          Conceitos
        </p>

        <h2 className="text-slate-900 text-5xl font-bold mb-10">
          O que é Observabilidade?
        </h2>

        <div className="grid grid-cols-2 gap-6 max-w-6xl mb-8">

          {/* Definição acadêmica */}

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
            <p className="text-blue-700 text-sm font-bold uppercase tracking-wider mb-4">
              Observability Engineering (2022)
            </p>

            <p className="text-slate-800 text-xl leading-relaxed">
              "Observabilidade é a capacidade de compreender qualquer estado de um
              sistema por meio de perguntas feitas sobre suas saídas externas."
            </p>

            <p className="text-slate-500 text-sm mt-6">
              Majors, Fong-Jones e Miranda (2022)
            </p>
          </div>

          {/* Definição didática */}

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <p className="text-slate-700 text-sm font-bold uppercase tracking-wider mb-4">
              Visão Prática
            </p>

            <p className="text-slate-800 text-xl leading-relaxed">
              "Capacidade de compreender o estado interno de um sistema através dos
              sinais que ele produz."
            </p>

            <p className="text-slate-500 text-sm mt-6">
              Adaptado da explicação do canal Código Fonte TV
            </p>
          </div>

        </div>

        {/* Conclusão */}

        <div className="bg-slate-900 rounded-2xl p-6 max-w-6xl mb-8">
          <p className="text-white text-xl text-center">
            Em sistemas modernos, esses sinais são representados principalmente por
            <strong> Logs</strong>, <strong> Métricas</strong> e
            <strong> Traces</strong>.
          </p>
        </div>

        {/* Preview dos pilares */}

        <div className="flex gap-4 max-w-5xl">

          <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">📄</div>
            <p className="font-bold text-green-800">Logs</p>
          </div>

          <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">📊</div>
            <p className="font-bold text-blue-800">Métricas</p>
          </div>

          <div className="flex-1 bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🔗</div>
            <p className="font-bold text-purple-800">Traces</p>
          </div>

        </div>

      </div>
    )
  },

  // 4 — Contexto (voltou ao layout simples com citação + frase do livro)
  {
    id: 4,
    content: (
      <div className="flex flex-col justify-center h-full px-16 py-8">
        <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-3">Contexto</p>
        <h2 className="text-slate-900 text-5xl font-bold mb-8">Observabilidade × Monitoramento</h2>

        <div className="grid grid-cols-2 gap-6 mb-8 max-w-4xl">

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <p className="text-orange-800 font-bold text-2xl mb-3">
              Monitoramento
            </p>

            <ul className="space-y-2 text-slate-700 text-base">
              <li>• Acompanha a saúde do sistema</li>
              <li>• Dashboards e métricas pré-definidas</li>
              <li>• Alertas para situações conhecidas</li>
              <li>• Responde: "Existe algum problema?"</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <p className="text-green-800 font-bold text-2xl mb-3">
              Observabilidade
            </p>

            <ul className="space-y-2 text-slate-700 text-base">
              <li>• Analisa o comportamento do sistema</li>
              <li>• Explora logs, métricas e traces</li>
              <li>• Investiga causas de falhas</li>
              <li>• Responde: "Por que isso aconteceu?"</li>
            </ul>
          </div>

        </div>

        <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 max-w-4xl text-center">
          <p className="text-slate-600 text-lg italic">
            “Monitoring tells you <strong>when</strong> something is wrong; observability helps you understand <strong>why</strong>.”
          </p>
          <p className="text-slate-400 text-sm mt-2">
            — Charity Majors, Liz Fong‑Jones, George Miranda · <em>Observability Engineering</em>
          </p>
          <p className="text-xs text-slate-400 mt-2">
            📘 O livro defende que sistemas modernos são complexos demais para depender apenas de dashboards fixos — é preciso conseguir fazer perguntas <strong>ad‑hoc</strong> em produção.
          </p>
        </div>
      </div>
    ),
  },

  // 5 — Três Pilares
  {
    id: 5,
    content: (
      <div className="flex flex-col justify-center h-full px-16 py-8">
        <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-3">Fundamentos</p>
        <h2 className="text-slate-900 text-5xl font-bold mb-8">Três Pilares da Observabilidade</h2>

        <div className="grid grid-cols-3 gap-5 max-w-5xl">
          {/* Logging */}
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-5">
            <p className="text-violet-800 font-bold text-xl mb-3">📄 Logging</p>
            <p className="text-slate-600 text-sm mb-3">Registros estruturados de eventos</p>
            <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono text-green-400">
              {`{
  "timestamp": "2026-06-25T10:23:45Z",
  "level": "error",
  "message": "Falha ao conectar BD",
  "trace_id": "abc123"
}`}
            </div>
          </div>

          {/* Métricas */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-blue-800 font-bold text-xl mb-3">📊 Métricas</p>
            <p className="text-slate-600 text-sm mb-3">Indicadores numéricos de desempenho (KPI)</p>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-slate-500">Taxa de erros HTTP 5xx</p>
                <p className="text-blue-800 text-lg font-mono font-bold">2,1 %</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs text-red-600 font-semibold">⚠ Alerta</p>
                <p className="text-xs text-slate-600 mt-1">Se {'>'}5% por 5 min → notificar</p>
              </div>
            </div>
          </div>

          {/* Tracing */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
            <p className="text-teal-800 font-bold text-xl mb-3">🔗 Tracing</p>
            <p className="text-slate-600 text-sm mb-3">Rastreamento distribuído de requisições</p>
            <div className="bg-white rounded-lg p-3 border border-teal-100 text-sm">
              <p className="text-teal-800 font-mono font-bold">Trace ID: xyz123</p>
              <div className="mt-2 space-y-1 text-xs">
                <p>⬜ API Gateway — 12 ms</p>
                <p className="ml-4">⬜ Auth Service — 10 ms</p>
                <p className="ml-4">⬜ User Service — 45 ms</p>
                <p className="ml-8">⬜ PostgreSQL — 20 ms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // 6 — Ferramentas de Mercado
  {
    id: 6,
    content: (
      <div className="flex flex-col justify-center h-full px-16 py-8">
        <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-3">Ecossistema</p>
        <h2 className="text-slate-900 text-5xl font-bold mb-8">Ferramentas de Mercado</h2>
        <div className="grid grid-cols-2 gap-8 max-w-5xl">

          <div>
            <h3 className="text-slate-900 text-2xl font-bold mb-4">
              Open Source
            </h3>

            <div className="space-y-3">

              {[
                'Prometheus',
                'Grafana',
                'Loki',
                'Jaeger',
                'OpenTelemetry'
              ].map(tool => (
                <div
                  key={tool}
                  className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3"
                >
                  {tool}
                </div>
              ))}

            </div>
          </div>

          <div>
            <h3 className="text-slate-900 text-2xl font-bold mb-4">
              Comerciais
            </h3>

            <div className="space-y-3">

              {[
                'Datadog',
                'New Relic',
                'Dynatrace'
              ].map(tool => (
                <div
                  key={tool}
                  className="bg-green-50 border border-green-200 rounded-xl px-5 py-3"
                >
                  {tool}
                </div>
              ))}

            </div>
          </div>

        </div>

        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-4xl">
          <p className="text-slate-700">
            Para este trabalho foram escolhidos
            <strong> Prometheus </strong>
            e
            <strong> Grafana </strong>
            por serem open source, amplamente adotados pela indústria
            e possuírem integração nativa para coleta e visualização de métricas.
          </p>
        </div>
      </div>
    ),
  },

  // ── Bloco prático (mantido a partir do slide 7) ─────────────────────────

  {
    id: 7,
    content: (
      <div className="flex flex-col justify-center items-center h-full px-16 py-8 text-center">

        <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-3">
          Transição
        </p>

        <h2 className="text-slate-900 text-6xl font-bold mb-10">
          Da Teoria para a Prática
        </h2>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 max-w-3xl">

          <div className="space-y-4 text-left">

            <p className="text-slate-700 text-xl">
              ✓ Conceitos de observabilidade
            </p>

            <p className="text-slate-700 text-xl">
              ✓ Monitoramento × Observabilidade
            </p>

            <p className="text-slate-700 text-xl">
              ✓ Três pilares fundamentais
            </p>

            <p className="text-slate-700 text-xl">
              ✓ Ferramentas utilizadas pelo mercado
            </p>

          </div>

          <div className="h-px bg-blue-200 my-8" />

          <p className="text-slate-900 text-2xl font-semibold">
            Agora vamos demonstrar a implementação
            desenvolvida para este trabalho.
          </p>

        </div>

      </div>
    )
  },

  // 8 — Cenário
  {
    id: 8,
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

  // 9 — Arquitetura
  {
    id: 9,
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

  // 10 — API REST
  {
    id: 10,
    content: (
      <div className="flex flex-col justify-center h-full px-16 py-8">
        <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-3">Implementação</p>
        <h2 className="text-slate-900 text-5xl font-bold mb-7">API RESTful — Endpoints</h2>
        <div className="space-y-2 max-w-2xl">
          {[
            { method: 'GET', bg: 'bg-green-100 text-green-800', path: '/api/alunos', desc: 'Listar todos (busca opcional)' },
            { method: 'GET', bg: 'bg-green-100 text-green-800', path: '/api/alunos/:id', desc: 'Buscar aluno por ID' },
            { method: 'POST', bg: 'bg-blue-100 text-blue-800', path: '/api/alunos', desc: 'Cadastrar novo aluno' },
            { method: 'PUT', bg: 'bg-yellow-100 text-yellow-800', path: '/api/alunos/:id', desc: 'Atualizar todos os campos' },
            { method: 'PATCH', bg: 'bg-orange-100 text-orange-800', path: '/api/alunos/:id', desc: 'Atualizar campos específicos' },
            { method: 'DELETE', bg: 'bg-red-100 text-red-800', path: '/api/alunos/:id', desc: 'Remover aluno' },
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

  // 11 — Stack de Observabilidade
  {
    id: 11,
    content: (
      <div className="flex flex-col justify-center h-full px-16 py-8">
        <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-3">Observabilidade</p>
        <h2 className="text-slate-900 text-5xl font-bold mb-8">Como funciona?</h2>
        <div className="flex gap-10 items-start max-w-4xl flex-wrap">
          {/* Fluxo */}
          <div className="flex-1 min-w-56 space-y-4">
            <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-2">Fluxo das métricas</p>
            {[
              ['API recebe requisição', 'Middleware registra método, rota, status, duração'],
              ['prom-client expõe /metrics', 'Contadores e histogramas em formato Prometheus'],
              ['Prometheus faz scrape', 'Coleta automaticamente a cada 10 segundos'],
              ['Grafana consulta', 'Queries PromQL nos dashboards em tempo real'],
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

  // 12 — Métricas Obrigatórias
  {
    id: 12,
    content: (
      <div className="flex flex-col justify-center h-full px-16 py-8">
        <p className="text-blue-600 text-base font-bold uppercase tracking-widest mb-3">Requisito Principal</p>
        <h2 className="text-slate-900 text-5xl font-bold mb-8">Métricas Implementadas</h2>
        <div className="grid grid-cols-2 gap-3 max-w-3xl">
          {[
            { metric: 'RPS', query: 'rate(http_requests_total[1m])' },
            { metric: 'Tempo médio resposta', query: 'histogram_sum / histogram_count' },
            { metric: 'Tempo máximo (p99)', query: 'histogram_quantile(0.99, ...)' },
            { metric: 'Total de requisições', query: 'http_requests_total' },
            { metric: 'Percentual de erros', query: 'http_errors_total / http_requests_total' },
            { metric: 'Códigos HTTP', query: 'label: status_code' },
            { metric: 'Uso de CPU', query: 'api_process_cpu_seconds_total' },
            { metric: 'Logs estruturados', query: 'Winston JSON — arquivo + console' },
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

  // 13 — Dashboard
  {
    id: 13,
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

  // 14 — Critérios de Avaliação
  {
    id: 14,
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

  // 15 — Fim
  {
    id: 15,
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

// ── Componente ──────────────────────────────────────────────────────────────

export default function ApresentacaoPage() {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent(c => Math.min(slides.length - 1, c + 1)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
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

      {/* Barra de navegação */}
      <div className="flex items-center justify-between px-8 py-4 bg-white border-t border-slate-200 flex-shrink-0">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          Fechar
        </button>

        <div className="flex gap-2 items-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${i === current ? 'bg-blue-600 w-6' : 'bg-slate-300 hover:bg-slate-400 w-2'
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