import React, { useState } from 'react';
import { 
  Search, Filter, Shield, Clock, 
  Calendar, CheckCircle, ArrowRight 
} from 'lucide-react';
import { AuditLog } from '../../types.ts';

interface AuditLogsViewProps {
  logs?: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const safeLogs = logs || [];

  const filtered = safeLogs.filter(l => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (l.details || '').toLowerCase().includes(term) ||
      (l.userName || '').toLowerCase().includes(term) ||
      (l.action || '').toLowerCase().includes(term) ||
      (l.entity || '').toLowerCase().includes(term);
    const matchesAction = actionFilter === 'All' || l.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const actions = Array.from(new Set(safeLogs.map(l => l.action).filter(Boolean)));

  return (
    <div className="space-y-6 text-left">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white">
            Security & Operational Audit Trail
          </h2>
          <p className="text-xs text-slate-400">
            Immutable log of all user activities, status changes, quotation conversions, and financial transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 w-52"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
          >
            <option value="All">All Operations</option>
            {actions.map(act => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator / User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Operational Details</th>
                <th className="py-3 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No activity logs matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-white font-semibold">
                      {log.userName}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[10px] font-bold">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      {log.entity}
                    </td>

                    <td className="py-3 px-4 text-slate-200 font-sans text-xs max-w-md truncate">
                      {log.details}
                    </td>

                    <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
