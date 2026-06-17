'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { RefreshCw, Activity, Clock, AlertTriangle, Database, Cpu, MemoryStick, ExternalLink } from 'lucide-react';

const GRAFANA_URL = process.env.NEXT_PUBLIC_GRAFANA_URL || 'http://localhost:3001';

// ── Tipos ────────────────────────────────────────────────────────────────────

interface StatData {
  rps: number | null;
  avgLatency: number | null;
  p99Latency: number | null;
  errorRate: number | null;
  totalRequests: number | null;
  cpu: number | null;
  memory: number | null;
}

interface TimePoint { time: string; value: number }
interface StatusSlice { name: string; value: number }

// ── Helpers Prometheus ────────────────────────────────────────────────────────

async function instant(promql: string): Promise<number | null> {
  try {
    const res = await fetch(`/api/prometheus/api/v1/query?query=${encodeURIComponent(promql)}`);
    const json = await res.json();
    if (json.status !== 'success' || !json.data.result.length) return null;
    const val = parseFloat(json.data.result[0].value[1]);
    return isNaN(val) ? null : val;
  } catch { return null; }
}

async function range(promql: string, hours = 1, step = '30s'): Promise<TimePoint[]> {
  try {
    const end   = Math.floor(Date.now() / 1000);
    const start = end - hours * 3600;
    const url   = `/api/prometheus/api/v1/query_range?query=${encodeURIComponent(promql)}&start=${start}&end=${end}&step=${step}`;
    const res   = await fetch(url);
    const json  = await res.json();
    if (json.status !== 'success' || !json.data.result.length) return [];
    return json.data.result[0].values.map(([ts, v]: [number, string]) => ({
      time: new Date(ts * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      value: parseFloat(parseFloat(v).toFixed(4)),
    }));
  } catch { return []; }
}

async function statusCodes(): Promise<StatusSlice[]> {
  try {
    const res  = await fetch(`/api/prometheus/api/v1/query?query=${encodeURIComponent('sum by (status_code) (http_requests_total)')}`);
    const json = await res.json();
    if (json.status !== 'success') return [];
    return json.data.result.map((r: { metric: { status_code: string }; value: [number, string] }) => ({
      name: `HTTP ${r.metric.status_code}`,
      value: parseFloat(r.value[1]),
    }));
  } catch { return []; }
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  label, value, unit, icon: Icon, color, loading,
}: {
  label: string; value: number | null; unit: string;
  icon: React.ElementType; color: string; loading: boolean;
}) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-500 bg-blue-50',
    green: 'text-green-500 bg-green-50',
    red: 'text-red-500 bg-red-50',
    orange: 'text-orange-500 bg-orange-50',
    purple: 'text-purple-500 bg-purple-50',
    teal: 'text-teal-500 bg-teal-50',
    slate: 'text-slate-500 bg-slate-100',
  };
  const cls = colorMap[color] || colorMap.slate;

  const fmt = (v: number | null) => {
    if (v === null) return '—';
    if (unit === 's') return v < 0.001 ? '< 1ms' : `${(v * 1000).toFixed(1)}ms`;
    if (unit === '%') return `${v.toFixed(1)}%`;
    if (unit === 'MB') return `${v.toFixed(0)} MB`;
    if (unit === 'req/s') return v.toFixed(2);
    return v.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cls}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      {loading ? (
        <div className="h-8 w-24 bg-slate-100 rounded animate-pulse" />
      ) : (
        <p className={`text-2xl font-bold ${value === null ? 'text-slate-300' : 'text-slate-800'}`}>
          {fmt(value)}
        </p>
      )}
      <p className="text-xs text-slate-400 mt-1">{unit === 's' ? 'ms' : unit}</p>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

const PIE_COLORS: Record<string, string> = {
  '200': '#22c55e', '201': '#86efac', '204': '#bbf7d0',
  '400': '#f97316', '404': '#fb923c', '409': '#fdba74',
  '500': '#ef4444', '502': '#f87171',
};
const fallbackColors = ['#2563EB','#7c3aed','#0891b2','#d97706','#dc2626'];

export default function DashboardPage() {
  const [stats, setStats]       = useState<StatData>({ rps: null, avgLatency: null, p99Latency: null, errorRate: null, totalRequests: null, cpu: null, memory: null });
  const [rpsData, setRpsData]   = useState<TimePoint[]>([]);
  const [latData, setLatData]   = useState<TimePoint[]>([]);
  const [pieData, setPieData]   = useState<StatusSlice[]>([]);
  const [loading, setLoading]   = useState(true);
  const [updatedAt, setUpdated] = useState('');

  const fetchAll = useCallback(async () => {
    const [rps, avgLat, p99Lat, errRate, total, cpu, mem, rpsRange, latRange, pie] =
      await Promise.all([
        instant('sum(rate(http_requests_total[1m]))'),
        instant('sum(rate(http_request_duration_seconds_sum[1m])) / sum(rate(http_request_duration_seconds_count[1m]))'),
        instant('histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[1m])))'),
        instant('sum(rate(http_errors_total[1m])) / sum(rate(http_requests_total[1m])) * 100'),
        instant('sum(http_requests_total)'),
        instant('rate(api_process_cpu_seconds_total[1m]) * 100'),
        instant('api_process_resident_memory_bytes / 1024 / 1024'),
        range('sum(rate(http_requests_total[1m]))'),
        range('histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[1m])))'),
        statusCodes(),
      ]);

    setStats({ rps, avgLatency: avgLat, p99Latency: p99Lat, errorRate: errRate, totalRequests: total, cpu, memory: mem });
    if (rpsRange.length) setRpsData(rpsRange);
    if (latRange.length) setLatData(latRange);
    if (pie.length)      setPieData(pie);
    setLoading(false);
    setUpdated(new Date().toLocaleTimeString('pt-BR'));
  }, []);

  useEffect(() => {
    fetchAll();
    const t = setInterval(fetchAll, 15000);
    return () => clearInterval(t);
  }, [fetchAll]);

  const noData = !loading && rpsData.length === 0 && stats.rps === null;

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Dashboard de Observabilidade</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Métricas em tempo real · atualiza a cada 15s
            {updatedAt && <span className="ml-2 text-slate-400">· última atualização: {updatedAt}</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`${GRAFANA_URL}/d/observability-api`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer border border-slate-200 rounded-lg px-3 py-2 hover:bg-white"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir Grafana
          </a>
          <button
            onClick={() => { setLoading(true); fetchAll(); }}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer border border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-50"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>
      </div>

      {noData && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl px-5 py-4 mb-6">
          Nenhuma métrica encontrada. Verifique se a API está online e o Prometheus está coletando dados.
          Rode <code className="bg-amber-100 px-1 rounded">node scripts/load.js &lt;API_URL&gt; 60</code> para gerar tráfego.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <StatCard label="RPS"              value={stats.rps}           unit="req/s" icon={Activity}    color="blue"   loading={loading} />
        <StatCard label="Latência média"   value={stats.avgLatency}    unit="s"     icon={Clock}       color="green"  loading={loading} />
        <StatCard label="Latência p99"     value={stats.p99Latency}    unit="s"     icon={Clock}       color="teal"   loading={loading} />
        <StatCard label="Taxa de erros"    value={stats.errorRate}     unit="%"     icon={AlertTriangle} color="red"  loading={loading} />
        <StatCard label="Total requisições" value={stats.totalRequests} unit="req"  icon={Database}    color="purple" loading={loading} />
        <StatCard label="CPU"              value={stats.cpu}           unit="%"     icon={Cpu}         color="orange" loading={loading} />
        <StatCard label="Memória"          value={stats.memory}        unit="MB"    icon={MemoryStick} color="slate"  loading={loading} />
      </div>

      {/* Gráficos de série temporal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* RPS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Requisições por Segundo (última 1h)</h3>
          {rpsData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-300 text-sm">Aguardando dados…</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={rpsData} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  formatter={(v: number) => [`${v.toFixed(3)} req/s`, 'RPS']}
                />
                <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Latência p95 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Latência p95 — ms (última 1h)</h3>
          {latData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-300 text-sm">Aguardando dados…</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={latData.map(d => ({ ...d, value: parseFloat((d.value * 1000).toFixed(2)) }))} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  formatter={(v: number) => [`${v} ms`, 'p95']}
                />
                <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Distribuição de status HTTP */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Distribuição de Códigos HTTP</h3>
        {pieData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-slate-300 text-sm">Aguardando dados…</div>
        ) : (
          <div className="flex items-center gap-8 flex-wrap">
            <ResponsiveContainer width={240} height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={2}>
                  {pieData.map((entry, i) => {
                    const code = entry.name.replace('HTTP ', '');
                    const color = PIE_COLORS[code] || fallbackColors[i % fallbackColors.length];
                    return <Cell key={entry.name} fill={color} />;
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  formatter={(v: number) => [v.toLocaleString('pt-BR'), 'requisições']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3">
              {pieData.map((entry, i) => {
                const code = entry.name.replace('HTTP ', '');
                const color = PIE_COLORS[code] || fallbackColors[i % fallbackColors.length];
                const total = pieData.reduce((s, d) => s + d.value, 0);
                const pct = total ? ((entry.value / total) * 100).toFixed(1) : '0';
                return (
                  <div key={entry.name} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-sm font-medium text-slate-700">{entry.name}</span>
                    <span className="text-slate-400 text-sm">{entry.value.toLocaleString('pt-BR')} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
