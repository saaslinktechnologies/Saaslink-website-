import React from 'react';
import { 
  Users, UserCheck, FileText, CreditCard, 
  Receipt, FolderKanban, TrendingUp, AlertTriangle, 
  ArrowUpRight, Plus, Clock, CheckCircle2, Shield 
} from 'lucide-react';
import { DashboardMetrics, GlobalSettings } from '../../types.ts';
import { AdminSection } from './AdminLayout.tsx';

interface DashboardViewProps {
  metrics: DashboardMetrics | null;
  settings: GlobalSettings;
  onNavigate: (section: AdminSection) => void;
  onOpenNewQuote: () => void;
  onOpenNewInvoice: () => void;
  onOpenNewLead: () => void;
  onOpenNewClient: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  settings,
  onNavigate,
  onOpenNewQuote,
  onOpenNewInvoice,
  onOpenNewLead,
  onOpenNewClient,
}) => {
  if (!metrics) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        <span className="ml-3 text-sm">Aggregating relational metrics...</span>
      </div>
    );
  }

  // Find max monthly revenue for graph scaling
  const monthlyRevenue = metrics.monthlyRevenue || [];
  const maxRevenue = monthlyRevenue.reduce((max, m) => Math.max(max, m.amount), 1000);

  return (
    <div className="space-y-8 text-left">
      
      {/* Top Banner & Quick Shortcuts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-display font-bold text-white">
            Operational Overview & Metrics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry and financial ledgers from SaaSLink MySQL platform.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNewLead}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>New Lead</span>
          </button>

          <button
            onClick={onOpenNewQuote}
            className="px-3 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>New Quotation</span>
          </button>

          <button
            onClick={onOpenNewInvoice}
            className="px-3 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Issue Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Invoiced */}
        <div 
          onClick={() => onNavigate('invoices')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Invoiced</span>
            <CreditCard className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
            ${metrics.totalInvoicedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Outstanding: <strong>${metrics.outstandingBalance.toLocaleString()}</strong></span>
            <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400" />
          </div>
        </div>

        {/* Payments Collected */}
        <div 
          onClick={() => onNavigate('receipts')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Revenue Collected</span>
            <Receipt className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-display font-bold text-emerald-400">
            ${metrics.totalPaymentsReceived.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Verified Official Receipts</span>
            <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400" />
          </div>
        </div>

        {/* Active Pipeline Leads */}
        <div 
          onClick={() => onNavigate('leads')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Leads & Inquiries</span>
            <UserCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-display font-bold text-white group-hover:text-amber-300 transition-colors">
            {metrics.totalLeads}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>{metrics.newLeads} awaiting review</span>
            <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400" />
          </div>
        </div>

        {/* Active Projects */}
        <div 
          onClick={() => onNavigate('projects')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
            <FolderKanban className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-display font-bold text-white group-hover:text-blue-300 transition-colors">
            {metrics.activeProjects}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Engineering in Sprint</span>
            <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400" />
          </div>
        </div>

      </div>

      {/* Financial Chart & Pipeline Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Revenue Bar Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-display font-bold text-white">
                Monthly Billing & Payments Volume
              </h3>
              <p className="text-[11px] text-slate-400">Recorded revenue distribution</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-cyan-400">
              USD ({settings.currency})
            </span>
          </div>

          {/* Simple Clean Accessible SVG/CSS Bar Chart */}
          <div className="h-48 pt-6 flex items-end justify-between gap-4 border-b border-slate-800 px-2">
            {monthlyRevenue.map((item, idx) => {
              const heightPercent = Math.max(12, Math.round((item.amount / maxRevenue) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${item.amount.toLocaleString()}
                  </div>
                  <div 
                    className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-cyan-900 to-cyan-400 transition-all group-hover:brightness-125"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] font-mono text-slate-400 mt-2">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span>Total Collected to Date: <strong className="text-emerald-400">${metrics.totalPaymentsReceived.toLocaleString()}</strong></span>
            <span>Total Quoted in Pipeline: <strong className="text-cyan-400">${metrics.totalQuotedValue.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Quick Summary & Overdue Alert */}
        <div className="lg:col-span-4 space-y-4">
          {metrics.overdueInvoicesCount > 0 && (
            <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-800/60 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-200">
                  {metrics.overdueInvoicesCount} Invoices Require Payment Follow-up
                </h4>
                <p className="text-[11px] text-rose-300 mt-1">
                  Invoices past their due date have an outstanding total balance.
                </p>
                <button
                  onClick={() => onNavigate('invoices')}
                  className="mt-2 text-xs font-bold text-rose-400 hover:underline"
                >
                  View Overdue Invoices →
                </button>
              </div>
            </div>
          )}

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Operational Health
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Active Database Engine</span>
                <span className="font-mono text-cyan-400 font-semibold">MySQL 8.0+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Quotation Lock Period</span>
                <span className="text-slate-200">30 Days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Standard Tax Rate</span>
                <span className="text-slate-200">{settings.defaultTaxRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Invoice Payment Term</span>
                <span className="text-slate-200">Net 14 Days</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => onNavigate('database')}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 transition-colors cursor-pointer"
              >
                Inspect MySQL Tables & Schema
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Inquiries / Leads */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-display font-bold text-white">
              Recent Inbound Leads
            </h3>
            <button
              onClick={() => onNavigate('leads')}
              className="text-xs text-cyan-400 hover:underline font-medium"
            >
              View All ({metrics.totalLeads}) →
            </button>
          </div>

          <div className="space-y-2">
            {(metrics.recentLeads || []).map((lead) => (
              <div
                key={lead.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{lead.fullName}</div>
                  <div className="text-[11px] text-slate-400">{lead.company || lead.email}</div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    lead.status === 'New' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                    lead.status === 'Won' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {lead.status}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Activity Log */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-display font-bold text-white">
              Security & Action Audit Log
            </h3>
            <button
              onClick={() => onNavigate('logs')}
              className="text-xs text-cyan-400 hover:underline font-medium"
            >
              Full History →
            </button>
          </div>

          <div className="space-y-2">
            {(metrics.recentActivity || []).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="text-slate-200 font-medium truncate">
                    {log.details}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
                    <span className="text-cyan-400">{log.userName}</span>
                    <span>•</span>
                    <span>{log.action}</span>
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
