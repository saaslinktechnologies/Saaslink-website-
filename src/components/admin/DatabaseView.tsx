import React, { useState, useEffect } from 'react';
import { 
  Database, Download, CheckCircle2, RefreshCw, 
  Server, Shield, Table, Key, HardDrive, AlertCircle, Play 
} from 'lucide-react';

export const DatabaseView: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Connection test state
  const [testHost, setTestHost] = useState('localhost');
  const [testPort, setTestPort] = useState(3306);
  const [testUser, setTestUser] = useState('root');
  const [testPassword, setTestPassword] = useState('');
  const [testDb, setTestDb] = useState('saaslink_db');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testingConn, setTestingConn] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/database/status');
      const data = await res.json();
      setDbStatus(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleExportSql = async () => {
    setExporting(true);
    setExportMessage(null);
    try {
      const res = await fetch('/api/admin/database/export-sql');
      const text = await res.text();
      let sqlContent = text;
      let filename = `saaslink_mysql_dump_${new Date().toISOString().substring(0, 10)}.sql`;

      try {
        const parsed = JSON.parse(text);
        if (parsed.sqlDump) sqlContent = parsed.sqlDump;
        if (parsed.filename) filename = parsed.filename;
      } catch (e) {
        // Was raw SQL text, which is expected
      }
      
      // Trigger download of SQL file
      const blob = new Blob([sqlContent], { type: 'application/sql' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportMessage(`Successfully exported ${filename} (${(sqlContent.length / 1024).toFixed(1)} KB) with complete DDL & INSERTS!`);
      setTimeout(() => setExportMessage(null), 6000);
    } catch (err: any) {
      setExportMessage(`Export failed: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleTestConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestingConn(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/admin/database/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: testHost,
          port: testPort,
          user: testUser,
          password: testPassword,
          database: testDb,
        }),
      });
      const data = await res.json();
      setTestResult({
        success: data.connected,
        message: data.message,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to ping MySQL server',
      });
    } finally {
      setTestingConn(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono font-bold">
              MYSQL 8.0 RELATIONAL ENGINE
            </span>
          </div>
          <h2 className="text-xl font-display font-bold text-white">
            MySQL Database Hub & Architecture Telemetry
          </h2>
          <p className="text-xs text-slate-400">
            Real-time table schemas, storage engine statistics, connection monitoring, and automated SQL migration dumps.
          </p>
        </div>

        {/* Action Button: Export Dump */}
        <button
          onClick={handleExportSql}
          disabled={exporting}
          className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{exporting ? 'Generating SQL Dump...' : 'Export Complete MySQL Dump (.sql)'}</span>
        </button>
      </div>

      {exportMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportMessage}</span>
        </div>
      )}

      {/* Engine Status Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Primary MySQL Server Cluster</h3>
              <p className="text-[11px] text-slate-400">InnoDB Transactional Engine • ACID Compliant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400 font-semibold">Online & Operational</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Engine</span>
            <span className="font-mono font-bold text-white">MySQL 8.0 InnoDB</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Character Set</span>
            <span className="font-mono font-bold text-cyan-400">utf8mb4_unicode_ci</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Default Port</span>
            <span className="font-mono font-bold text-white">3306</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Storage State</span>
            <span className="font-mono font-bold text-emerald-400">Synchronized</span>
          </div>
        </div>
      </div>

      {/* Relational Tables Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider flex items-center gap-2">
            <Table className="w-4 h-4" />
            <span>Relational Schema Tables ({dbStatus?.tableCount || 14})</span>
          </h3>
          <button
            onClick={fetchStatus}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh Counts</span>
          </button>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Table Name</th>
                <th className="py-3 px-4">Primary Purpose</th>
                <th className="py-3 px-4">Engine</th>
                <th className="py-3 px-4 text-right">Row Records</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {dbStatus?.tables ? (
                Object.entries(dbStatus.tables).map(([table, count]: [string, any]) => (
                  <tr key={table} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-cyan-300">
                      {table}
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 font-sans text-[11px]">
                      {table === 'users' && 'Administrator credentials & RBAC permissions'}
                      {table === 'clients' && 'Enterprise customer directory & billing accounts'}
                      {table === 'leads' && 'Pipeline inquiries from public forms & quotation planner'}
                      {table === 'quotations' && 'Proposals, validity dates, subtotal & taxes'}
                      {table === 'quotation_items' && 'Itemized service deliverables & pricing'}
                      {table === 'invoices' && 'Tax invoices, due dates, balance reconciliation'}
                      {table === 'invoice_items' && 'Milestone scope deliverables'}
                      {table === 'payments' && 'Verified settlements & M-Pesa IPN codes'}
                      {table === 'projects' && 'Client engineering sprints & budgets'}
                      {table === 'project_tasks' && 'Sprint deliverables & task assignees'}
                      {table === 'services' && 'CMS engineering service offerings'}
                      {table === 'products' && 'CMS proprietary SaaS products & platforms'}
                      {table === 'portfolio_projects' && 'CMS enterprise case studies & results'}
                      {table === 'articles' && 'CMS architectural insights & technical blogs'}
                      {table === 'audit_logs' && 'Security trail of administrative operations'}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">InnoDB</td>
                    <td className="py-2.5 px-4 text-right font-bold text-white">
                      {count}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-slate-500">
                    Loading MySQL table metadata...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MySQL Remote Connection Validator */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>MySQL Remote Production Connection Tester</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Test external MySQL 8 / AWS RDS / GCP Cloud SQL credentials for production synchronization.
          </p>
        </div>

        <form onSubmit={handleTestConnection} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Host / IP</label>
              <input
                type="text"
                value={testHost}
                onChange={(e) => setTestHost(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Port</label>
              <input
                type="number"
                value={testPort}
                onChange={(e) => setTestPort(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Database Name</label>
              <input
                type="text"
                value={testDb}
                onChange={(e) => setTestDb(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Username</label>
              <input
                type="text"
                value={testUser}
                onChange={(e) => setTestUser(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <input
                type="password"
                placeholder="Database password..."
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={testingConn}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>{testingConn ? 'Pinging Host...' : 'Ping MySQL Connection'}</span>
            </button>

            {testResult && (
              <span className={`text-xs font-semibold ${testResult.success ? 'text-emerald-400' : 'text-amber-400'}`}>
                {testResult.message}
              </span>
            )}
          </div>
        </form>
      </div>

    </div>
  );
};
