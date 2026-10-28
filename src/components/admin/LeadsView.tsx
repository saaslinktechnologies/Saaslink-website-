import React, { useState } from 'react';
import { 
  UserCheck, Search, Filter, Trash2, Edit, 
  ArrowRight, Phone, Mail, Building, Clock, 
  Calendar, CheckCircle, AlertCircle, Plus 
} from 'lucide-react';
import { Lead, LeadStatus, LeadType } from '../../types.ts';

interface LeadsViewProps {
  leads?: Lead[];
  onUpdateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  onDeleteLead: (id: string) => Promise<void>;
  onConvertToClient: (lead: Lead) => Promise<void>;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads = [],
  onUpdateLead,
  onDeleteLead,
  onConvertToClient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const safeLeads = leads || [];

  const statuses: (LeadStatus | 'All')[] = [
    'All', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost', 'Archived'
  ];

  const filteredLeads = safeLeads.filter((lead) => {
    const matchesSearch = 
      (lead.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setInternalNotes(lead.notes || '');
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setSavingNotes(true);
    await onUpdateLead(selectedLead.id, { notes: internalNotes });
    setSelectedLead({ ...selectedLead, notes: internalNotes });
    setSavingNotes(false);
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    await onUpdateLead(leadId, { status: newStatus });
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white">
            Inbound Leads & Opportunities
          </h2>
          <p className="text-xs text-slate-400">
            Pipeline of inquiries submitted through website forms and quotation planner.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 w-48"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>{st === 'All' ? 'All Statuses' : st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Contact / Organization</th>
                <th className="py-3 px-4">Inquiry Details</th>
                <th className="py-3 px-4">Budget / Timeline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No leads matching your current criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id}
                    onClick={() => handleSelectLead(lead)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{lead.fullName}</div>
                      <div className="text-[11px] text-slate-400">{lead.company || 'Individual Prospect'}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{lead.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-cyan-400 font-medium">{lead.serviceOfInterest || 'General Enterprise System'}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{lead.message}</div>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 mt-1 inline-block">
                        {lead.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-medium">{lead.budgetRange || 'Unspecified'}</div>
                      <div className="text-[11px] text-slate-400">{lead.timeline || 'Standard'}</div>
                    </td>

                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border focus:outline-none cursor-pointer ${
                          lead.status === 'New' ? 'bg-cyan-950 text-cyan-400 border-cyan-800' :
                          lead.status === 'Won' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                          lead.status === 'Qualified' ? 'bg-blue-950 text-blue-400 border-blue-800' :
                          lead.status === 'Lost' ? 'bg-rose-950 text-rose-400 border-rose-800' :
                          'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {statuses.filter(s => s !== 'All').map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {lead.status !== 'Won' && (
                          <button
                            onClick={() => onConvertToClient(lead)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[11px] font-semibold transition-colors"
                            title="Convert into client account"
                          >
                            Convert to Client
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteLead(lead.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="Delete lead record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Lead Detail Drawer */}
      {selectedLead && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                  Lead Details #{selectedLead.id.slice(-6)}
                </span>
                <h3 className="text-lg font-display font-bold text-white">
                  {selectedLead.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Core Info */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <a href={`mailto:${selectedLead.email}`} className="hover:underline">{selectedLead.email}</a>
                </div>
                {selectedLead.phone && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                    <a href={`tel:${selectedLead.phone}`} className="hover:underline">{selectedLead.phone}</a>
                  </div>
                )}
                {selectedLead.company && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Building className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{selectedLead.company}</span>
                  </div>
                )}
              </div>

              {/* Requirement & Message */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-semibold text-slate-200">System of Interest:</div>
                <div className="text-cyan-400 font-medium">{selectedLead.serviceOfInterest || 'Custom Software'}</div>
                
                <div className="font-semibold text-slate-200 pt-2">Full Inquiry Scope:</div>
                <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                  {selectedLead.message}
                </p>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Internal Architectural Notes & Qualification:
                </label>
                <textarea
                  rows={4}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Record client requirements, follow-up call notes, or architectural constraints..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={() => onConvertToClient(selectedLead)}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Convert to Official Client</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
