import { ExternalLink } from 'lucide-react';

const GRAFANA_URL = process.env.NEXT_PUBLIC_GRAFANA_URL || 'http://localhost:3001';
const DASHBOARD_UID = 'observability-api';
const IFRAME_URL = `${GRAFANA_URL}/d/${DASHBOARD_UID}/observabilidade-da-api?orgId=1&kiosk=tv&from=now-1h&to=now&refresh=10s`;

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200 flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Dashboard de Observabilidade</h1>
          <p className="text-sm text-slate-500 mt-0.5">Métricas em tempo real da API de alunos</p>
        </div>
        <a
          href={`${GRAFANA_URL}/d/${DASHBOARD_UID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          Abrir no Grafana
        </a>
      </header>

      <div className="flex-1 overflow-hidden">
        <iframe
          src={IFRAME_URL}
          className="w-full h-full border-0"
          title="Dashboard Grafana — Observabilidade da API"
          allowFullScreen
        />
      </div>
    </div>
  );
}
