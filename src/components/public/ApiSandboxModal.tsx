import React, { useState } from 'react';
import { 
  Terminal, Play, Check, Copy, X, 
  Code, ArrowRight, ShieldCheck, Clock, RefreshCw 
} from 'lucide-react';

interface ApiSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestQuote: () => void;
}

interface EndpointConfig {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  name: string;
  description: string;
  defaultPayload?: string;
  mockResponse: Record<string, any>;
}

const ENDPOINTS: EndpointConfig[] = [
  {
    id: 'health',
    method: 'GET',
    path: '/api/health',
    name: 'Cluster Health Check',
    description: 'Returns real-time service uptime, active microservice status, and server clock timestamp.',
    mockResponse: {
      status: 'healthy',
      service: 'SaaSLink Technologies Enterprise Core',
      uptime_pct: '99.98%',
      active_cluster: 'nairobi-westlands-node-01',
      p95_latency_ms: 114,
      dpa_compliance: 'verified',
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'quote',
    method: 'POST',
    path: '/api/v1/scope-estimate',
    name: 'Real-Time Scoping & Architecture API',
    description: 'Submits modular platform specifications to generate automated timeline, team allocation, and architecture topology.',
    defaultPayload: JSON.stringify({
      platform_type: 'ERP & SACCO Core',
      integrations: ['M-Pesa Daraja', 'KRA eTIMS', 'SMS Gateway'],
      security_tier: 'ISO-27001-Compliant',
      target_concurrency: '50,000 daily active accounts',
    }, null, 2),
    mockResponse: {
      status: 'success',
      estimated_sprints: 5,
      delivery_timeline_weeks: 10,
      ip_ownership: '100% Client-Assigned on Day 1',
      architecture_recommendation: {
        database: 'Clustered MySQL 8.0 / PostgreSQL with connection pooler',
        orchestration: 'Kubernetes on AWS with zero-downtime rolling deploys',
        cache: 'Redis in-memory token bucket rate limiting',
        compliance: 'Kenya DPA 2019 encrypted at rest (AES-256)',
      },
      assigned_lead: 'Senior Solutions Architect (Westlands Studio)',
    },
  },
  {
    id: 'mpesa-webhook',
    method: 'POST',
    path: '/api/v1/webhooks/mpesa-daraja',
    name: 'M-Pesa Daraja IPN Webhook Receiver',
    description: 'Simulates instantaneous payment callback validation, automated double-entry ledger settlement, and digital receipt dispatch.',
    defaultPayload: JSON.stringify({
      TransactionType: 'CustomerPayBillOnline',
      TransID: 'SLK99827419',
      TransTime: '20261027133000',
      TransAmount: '450000.00',
      BusinessShortCode: '600110',
      BillRefNumber: 'INV-2026-089',
      MSISDN: '254700000000',
      KYC_Verified: true,
    }, null, 2),
    mockResponse: {
      response_code: '0',
      response_desc: 'Success: Transaction settled in General Ledger and automated receipt queued',
      ledger_entry_id: 'GL-TX-8829104',
      reconciliation_time_ms: 84,
      eTIMS_hash_generated: true,
    },
  },
];

export const ApiSandboxModal: React.FC<ApiSandboxModalProps> = ({
  isOpen,
  onClose,
  onRequestQuote,
}) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointConfig>(ENDPOINTS[0]);
  const [activeTab, setActiveTab] = useState<'curl' | 'typescript' | 'python'>('curl');
  const [requestBody, setRequestBody] = useState<string>(selectedEndpoint.defaultPayload || '');
  const [responseOutput, setResponseOutput] = useState<any>(selectedEndpoint.mockResponse);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState(112);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleSelectEndpoint = (ep: EndpointConfig) => {
    setSelectedEndpoint(ep);
    setRequestBody(ep.defaultPayload || '');
    setResponseOutput(ep.mockResponse);
  };

  const handleRunRequest = () => {
    setIsExecuting(true);
    const start = performance.now();
    setTimeout(() => {
      const elapsed = Math.round(performance.now() - start + 80 + Math.random() * 40);
      setExecutionTime(elapsed);
      setIsExecuting(false);
      setResponseOutput({
        ...selectedEndpoint.mockResponse,
        executed_at: new Date().toISOString(),
        round_trip_ms: elapsed,
      });
    }, 450);
  };

  const getCodeSnippet = () => {
    const fullUrl = `https://api.saaslink.tech${selectedEndpoint.path}`;
    if (activeTab === 'curl') {
      if (selectedEndpoint.method === 'GET') {
        return `curl -X GET "${fullUrl}" \\\n  -H "Accept: application/json"`;
      }
      return `curl -X POST "${fullUrl}" \\\n  -H "Content-Type: application/json" \\\n  -d '${requestBody.replace(/\n/g, '')}'`;
    }
    if (activeTab === 'typescript') {
      if (selectedEndpoint.method === 'GET') {
        return `const response = await fetch("${fullUrl}", {\n  headers: { "Accept": "application/json" },\n});\nconst data = await response.json();\nconsole.log(data);`;
      }
      return `const response = await fetch("${fullUrl}", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify(${requestBody}),\n});\nconst result = await response.json();`;
    }
    if (activeTab === 'python') {
      if (selectedEndpoint.method === 'GET') {
        return `import requests\n\nr = requests.get("${fullUrl}")\nprint(r.json())`;
      }
      return `import requests\n\npayload = ${requestBody}\nr = requests.post("${fullUrl}", json=payload)\nprint(r.json())`;
    }
    return '';
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-up">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[oklch(0.78_0.12_78/0.4)] bg-[oklch(0.24_0.035_165)] shadow-2xl p-6 sm:p-8 text-slate-100">
        
        {/* Modal Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] p-0.5 shadow-gold">
            <div className="w-full h-full bg-[oklch(0.24_0.03_165)] rounded-[10px] flex items-center justify-center text-[oklch(0.82_0.12_82)]">
              <Terminal className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="eyebrow text-xs">Developer Tools & Infrastructure</p>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Dynamic API Documentation & Live Sandbox
            </h3>
          </div>
        </div>

        {/* Endpoint Selector Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 p-1.5 rounded-2xl bg-black/30 border border-white/10">
          {ENDPOINTS.map((ep) => (
            <button
              key={ep.id}
              onClick={() => handleSelectEndpoint(ep)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                selectedEndpoint.id === ep.id
                  ? 'bg-[oklch(0.78_0.12_78)] text-[oklch(0.22_0.03_165)] shadow-gold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                ep.method === 'POST' ? 'bg-amber-500/20 text-amber-200' : 'bg-emerald-500/20 text-emerald-200'
              }`}>
                {ep.method}
              </span>
              <span>{ep.name}</span>
            </button>
          ))}
        </div>

        {/* Endpoint Detail & Path */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
              <span className="font-bold text-[oklch(0.78_0.12_78)]">{selectedEndpoint.method}</span>
              <span className="text-white font-semibold">https://api.saaslink.tech{selectedEndpoint.path}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {selectedEndpoint.description}
            </p>
          </div>
          <button
            onClick={handleRunRequest}
            disabled={isExecuting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] px-4 py-2 text-xs font-semibold text-[oklch(0.22_0.03_165)] shadow-gold hover:-translate-y-0.5 transition-transform cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isExecuting ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Send Request</span>
              </>
            )}
          </button>
        </div>

        {/* Request & Response Split Screen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Left: Code Snippet & Request Payload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(['curl', 'typescript', 'python'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                      activeTab === lang 
                        ? 'bg-white/15 text-white font-semibold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white font-mono"
              >
                {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-slate-300 overflow-x-auto max-h-48">
              {getCodeSnippet()}
            </pre>

            {selectedEndpoint.defaultPayload && (
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Editable Request Payload (JSON)
                </span>
                <textarea
                  rows={5}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs text-white placeholder-slate-500 focus:border-gold focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Right: Live Response Output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Live Server Response
              </span>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  200 OK
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {executionTime}ms
                </span>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto max-h-80 leading-relaxed shadow-inner">
              {JSON.stringify(responseOutput, null, 2)}
            </pre>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Need custom endpoints, webhook signatures, or API specs?
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg border border-white/10 hover:bg-white/5"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRequestQuote();
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] px-5 py-2 text-xs font-semibold text-[oklch(0.22_0.03_165)] shadow-gold"
            >
              <span>Schedule Architecture Scoping</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
