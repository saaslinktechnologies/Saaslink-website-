import React, { useState } from 'react';
import { 
  Users, Search, Plus, Mail, Phone, MapPin, 
  Building, FileText, CreditCard, Receipt, 
  FolderKanban, ExternalLink, Edit2, Trash2, CheckCircle2 
} from 'lucide-react';
import { Client, Quotation, Invoice, Payment, Project } from '../../types.ts';

interface ClientsViewProps {
  clients?: Client[];
  quotations?: Quotation[];
  invoices?: Invoice[];
  payments?: Payment[];
  projects?: Project[];
  onCreateClient: (clientData: Partial<Client>) => Promise<void>;
  onUpdateClient: (id: string, clientData: Partial<Client>) => Promise<void>;
  onDeleteClient: (id: string) => Promise<void>;
  onOpenNewQuoteForClient: (client: Client) => void;
  onOpenNewInvoiceForClient: (client: Client) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients = [],
  quotations = [],
  invoices = [],
  payments = [],
  projects = [],
  onCreateClient,
  onUpdateClient,
  onDeleteClient,
  onOpenNewQuoteForClient,
  onOpenNewInvoiceForClient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const safeClients = clients || [];
  const safeQuotations = quotations || [];
  const safeInvoices = invoices || [];
  const safePayments = payments || [];
  const safeProjects = projects || [];

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    city: 'Nairobi',
    country: 'Kenya',
    taxId: '',
    contactPerson: '',
    notes: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const filtered = safeClients.filter(c => 
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      city: 'Nairobi',
      country: 'Kenya',
      taxId: '',
      contactPerson: '',
      notes: '',
      status: 'Active',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      address: client.address || '',
      city: client.city || 'Nairobi',
      country: client.country || 'Kenya',
      taxId: client.taxId || '',
      contactPerson: client.contactPerson || '',
      notes: client.notes || '',
      status: client.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      await onUpdateClient(editingClient.id, formData);
      if (selectedClient && selectedClient.id === editingClient.id) {
        setSelectedClient({ ...selectedClient, ...formData });
      }
    } else {
      await onCreateClient(formData);
    }
    setModalOpen(false);
  };

  // 360-degree data for currently selected client
  const clientQuotes = selectedClient ? safeQuotations.filter(q => q.clientId === selectedClient.id) : [];
  const clientInvoices = selectedClient ? safeInvoices.filter(i => i.clientId === selectedClient.id) : [];
  const clientPayments = selectedClient ? safePayments.filter(p => p.clientId === selectedClient.id) : [];
  const clientProjects = selectedClient ? safeProjects.filter(p => p.clientId === selectedClient.id) : [];

  const totalInvoiced = clientInvoices.reduce((sum, i) => sum + i.total, 0);
  const totalPaid = clientPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalBalance = clientInvoices.reduce((sum, i) => sum + i.balanceDue, 0);

  return (
    <div className="space-y-6 text-left">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white">
            Clients & Accounts Directory
          </h2>
          <p className="text-xs text-slate-400">
            360-degree view of corporate client relationships, financial ledgers, and active projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 w-48"
            />
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((client) => {
          const clientInvs = safeInvoices.filter(i => i.clientId === client.id);
          const balance = clientInvs.reduce((sum, i) => sum + i.balanceDue, 0);

          return (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className={`p-6 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                selectedClient?.id === client.id
                  ? 'bg-slate-900 border-cyan-400 shadow-xl shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 font-bold text-sm">
                    {client.company.charAt(0)}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    client.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {client.status}
                  </span>
                </div>

                <h3 className="text-base font-display font-bold text-white mb-0.5">
                  {client.company}
                </h3>
                <p className="text-xs text-slate-400 mb-4">{client.name}</p>

                <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800 pt-3">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.city && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{client.city}, {client.country}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Balance Due</span>
                  <span className={`font-semibold ${balance > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(client);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    title="Edit Client"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClient(client.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40"
                    title="Delete Client"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 360-Degree Client Profile Drawer */}
      {selectedClient && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                  Client 360° Profile
                </span>
                <h3 className="text-xl font-display font-bold text-white">
                  {selectedClient.company}
                </h3>
                <p className="text-xs text-slate-400">Account #{selectedClient.id}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(selectedClient)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Financial Summary Ribbon */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Total Invoiced</span>
                <span className="text-sm font-bold text-white">${totalInvoiced.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Payments Paid</span>
                <span className="text-sm font-bold text-emerald-400">${totalPaid.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Outstanding</span>
                <span className={`text-sm font-bold ${totalBalance > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                  ${totalBalance.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Quick Actions for this Client */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenNewQuoteForClient(selectedClient)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Create Quotation</span>
              </button>

              <button
                onClick={() => onOpenNewInvoiceForClient(selectedClient)}
                className="flex-1 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Create Invoice</span>
              </button>
            </div>

            {/* Connected Projects */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                <FolderKanban className="w-3.5 h-3.5 text-blue-400" />
                <span>Active Projects ({clientProjects.length})</span>
              </h4>

              {clientProjects.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No projects created yet for this client.</p>
              ) : (
                <div className="space-y-2">
                  {clientProjects.map(p => (
                    <div key={p.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white">{p.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono ml-2">{p.code}</span>
                      </div>
                      <span className="text-cyan-400 font-mono">{p.progress}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Connected Invoices */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                <span>Invoices ({clientInvoices.length})</span>
              </h4>

              {clientInvoices.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No invoices issued for this client.</p>
              ) : (
                <div className="space-y-2">
                  {clientInvoices.map(inv => (
                    <div key={inv.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white">{inv.invoiceNumber}</span>
                        <span className="text-[10px] text-slate-400 ml-2">Due: {inv.dueDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white">${inv.total.toLocaleString()}</span>
                        <span className="text-[10px] block text-slate-400">{inv.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Connected Quotations */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>Quotations ({clientQuotes.length})</span>
              </h4>

              {clientQuotes.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No quotations sent to this client.</p>
              ) : (
                <div className="space-y-2">
                  {clientQuotes.map(q => (
                    <div key={q.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white">{q.quotationNumber}</span>
                        <span className="text-[10px] text-slate-400 ml-2">Valid until: {q.expiryDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white">${q.total.toLocaleString()}</span>
                        <span className="text-[10px] block text-slate-400">{q.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Add/Edit Client Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-left">
            <h3 className="text-lg font-display font-bold text-white mb-4">
              {editingClient ? 'Edit Client Profile' : 'Register New Client Account'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Primary Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Billing Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">KRA PIN / Tax ID</label>
                  <input
                    type="text"
                    placeholder="e.g. P051234567Z"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City / Region</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Physical Address</label>
                <input
                  type="text"
                  placeholder="e.g. 5th Floor, Delta Towers, Westlands"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Account Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold"
                >
                  {editingClient ? 'Save Changes' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
