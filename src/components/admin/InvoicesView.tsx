import React, { useState } from 'react';
import { 
  CreditCard, Plus, Eye, Printer, CheckCircle2, 
  Search, AlertCircle, DollarSign, Receipt, Calendar, ArrowRight 
} from 'lucide-react';
import { Invoice, Client, GlobalSettings, InvoiceItem, Payment } from '../../types.ts';

interface InvoicesViewProps {
  invoices?: Invoice[];
  clients?: Client[];
  settings?: GlobalSettings;
  onCreateInvoice: (data: any) => Promise<void>;
  onRecordPayment: (data: any) => Promise<void>;
  initialClient?: Client | null;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices = [],
  clients = [],
  settings,
  onCreateInvoice,
  onRecordPayment,
  initialClient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(!!initialClient);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<Invoice | null>(null);
  const safeInvoices = invoices || [];
  const safeClients = clients || [];

  // Form State for New Invoice
  const [clientId, setClientId] = useState(initialClient?.id || (safeClients[0]?.id || ''));
  const [issueDate, setIssueDate] = useState(new Date().toISOString().substring(0, 10));
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10));
  const [currency, setCurrency] = useState(settings?.currency || 'USD');
  const [taxRate, setTaxRate] = useState(settings?.defaultTaxRate || 16);
  const [notes, setNotes] = useState('Payment due within 14 days from date of invoice.');
  const [terms, setTerms] = useState('Work deliverables remain the intellectual property of SaaSLink Technologies Ltd until invoice is settled in full.');

  const [items, setItems] = useState<Omit<InvoiceItem, 'id' | 'total'>[]>([
    { type: 'service', description: 'Enterprise Custom Software Development Sprint', quantity: 1, unitPrice: 3500, discount: 0 },
  ]);

  // Payment Modal Form State
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'Bank Wire Transfer' | 'M-Pesa Express/Paybill' | 'Cash' | 'Cheque' | 'Credit Card'>('Bank Wire Transfer');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('');
  const [isRecordingPay, setIsRecordingPay] = useState(false);

  const filtered = safeInvoices.filter(inv => {
    const matchesSearch = 
      (inv.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.clientCompany || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const subtotal = items.reduce((sum, it) => sum + (it.quantity * it.unitPrice - (it.discount || 0)), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount;

  const handleAddItem = () => {
    setItems([...items, { type: 'service', description: 'Engineering Milestone', quantity: 1, unitPrice: 1000, discount: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, idx) => idx !== index));
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateInvoice({
      clientId,
      issueDate,
      dueDate,
      currency,
      items,
      taxRate,
      notes,
      terms,
      status: 'Sent',
    });
    setCreateModalOpen(false);
  };

  const handleOpenPayment = (inv: Invoice) => {
    setPaymentModalInvoice(inv);
    setPayAmount(inv.balanceDue);
    setPayRef(`TXN-${Date.now().toString().slice(-6)}`);
    setPayNotes(`Payment for Invoice ${inv.invoiceNumber}`);
  };

  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice) return;
    setIsRecordingPay(true);

    await onRecordPayment({
      invoiceId: paymentModalInvoice.id,
      amount: Number(payAmount),
      method: payMethod,
      reference: payRef,
      paymentDate: new Date().toISOString().substring(0, 10),
      notes: payNotes,
    });

    setIsRecordingPay(false);
    setPaymentModalInvoice(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white">
            Invoices & Accounts Receivable
          </h2>
          <p className="text-xs text-slate-400">
            Issue tax invoices, track reconciliation, and record direct client settlements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 w-44"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Issue Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Invoice Number</th>
                <th className="py-3 px-4">Client / Account</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No invoices found. Click "Issue Invoice" to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-cyan-400">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{inv.clientCompany}</div>
                      <div className="text-[11px] text-slate-400">{inv.clientName}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200">{inv.dueDate}</div>
                      <div className="text-[10px] text-slate-500">Issued: {inv.issueDate}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      ${inv.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className={inv.balanceDue > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                        ${inv.balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                        inv.status === 'Paid' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        inv.status === 'Partially Paid' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        inv.status === 'Overdue' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        inv.status === 'Sent' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {inv.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewInvoice(inv)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                          title="View Official Invoice"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>View</span>
                        </button>

                        {inv.balanceDue > 0 && (
                          <button
                            onClick={() => handleOpenPayment(inv)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Record Payment"
                          >
                            <DollarSign className="w-3 h-3" />
                            <span>Record Pay</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                  Record Settlement
                </span>
                <h3 className="text-base font-display font-bold text-white">
                  Payment for {paymentModalInvoice.invoiceNumber}
                </h3>
              </div>
              <button
                onClick={() => setPaymentModalInvoice(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Client Account:</span>
                  <span className="text-white font-medium">{paymentModalInvoice.clientCompany}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Outstanding Balance:</span>
                  <span className="text-amber-400 font-bold font-mono">
                    ${paymentModalInvoice.balanceDue.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Amount Paid (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  max={paymentModalInvoice.balanceDue}
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Settlement Channel *</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="Bank Wire Transfer">Bank Wire Transfer (KCB / Equity)</option>
                  <option value="M-Pesa Express/Paybill">M-Pesa Business Paybill / Till</option>
                  <option value="Credit Card">Corporate Credit Card (Stripe)</option>
                  <option value="Cheque">Corporate Bank Cheque</option>
                  <option value="Cash">Cash Deposit</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Transaction / Reference Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. QHK8941234 or WIRE-89912"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Internal Reconciliation Notes</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isRecordingPay}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isRecordingPay ? 'Recording...' : 'Confirm & Generate Receipt'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Branded Invoice Preview (Print-Ready) */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-3xl shadow-2xl text-left my-8 overflow-hidden print:m-0 print:w-full print:shadow-none">
            
            {/* Modal Screen Controls */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold">Official Tax Invoice — {previewInvoice.invoiceNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setPreviewInvoice(null)}
                  className="text-slate-400 hover:text-white px-2 py-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="p-8 sm:p-12 space-y-8 text-xs font-sans">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded bg-slate-950 text-cyan-400 flex items-center justify-center font-bold text-xs">
                      SL
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-950">
                      SaaSLink Technologies Ltd
                    </h1>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-snug">
                    {settings?.companyAddress || settings?.address || 'Delta Corner Tower, Westlands, Nairobi, Kenya'}<br />
                    PIN: {settings?.taxId || 'P051982341Z'} | Phone: {settings?.companyPhone || settings?.phone || '+254 720 000 000'}<br />
                    Email: {settings?.companyEmail || settings?.email || 'contact@saaslink.tech'} | Web: {settings?.companyWebsite || settings?.website || 'https://saaslink.tech'}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-extrabold tracking-tight text-cyan-700">
                    TAX INVOICE
                  </div>
                  <p className="font-mono text-sm font-bold text-slate-800 mt-1">
                    {previewInvoice.invoiceNumber}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Date: {previewInvoice.issueDate}<br />
                    <strong>Due Date: {previewInvoice.dueDate}</strong>
                  </p>
                </div>
              </div>

              {/* Client Box */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Billed To:</span>
                  <div className="font-bold text-sm text-slate-900">{previewInvoice.clientCompany}</div>
                  <div className="text-slate-700">{previewInvoice.clientName}</div>
                  <div className="text-slate-600">{previewInvoice.clientEmail}</div>
                  {previewInvoice.clientAddress && <div className="text-slate-600">{previewInvoice.clientAddress}</div>}
                </div>

                <div className="text-right space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Account Summary:</span>
                  <div className="text-slate-700">Currency: <strong>{previewInvoice.currency}</strong></div>
                  <div className="text-slate-700">Status: <strong>{previewInvoice.status}</strong></div>
                  <div className="text-amber-700 font-bold">
                    Balance Due: ${previewInvoice.balanceDue.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-900 text-[11px] font-bold uppercase text-slate-700">
                      <th className="py-2.5">Scope Deliverable / Item</th>
                      <th className="py-2.5 text-center">Qty</th>
                      <th className="py-2.5 text-right">Unit Price</th>
                      <th className="py-2.5 text-right">Total ({previewInvoice.currency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {(previewInvoice.items || []).map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 pr-4">
                          <div className="font-semibold text-slate-900">{item.description}</div>
                          <div className="text-[11px] text-slate-500 uppercase font-mono">{item.type}</div>
                        </td>
                        <td className="py-3 text-center">{item.quantity}</td>
                        <td className="py-3 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                        <td className="py-3 text-right font-mono font-semibold">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Box */}
              <div className="flex justify-end pt-4">
                <div className="w-72 space-y-2 border-t border-slate-300 pt-3 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold">${previewInvoice.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>VAT / Tax ({previewInvoice.taxRate}%):</span>
                    <span className="font-mono font-semibold">${previewInvoice.taxAmount.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-slate-300 pt-2 flex justify-between text-sm font-bold text-slate-950">
                    <span>Total Invoiced:</span>
                    <span className="font-mono">${previewInvoice.total.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Paid to Date:</span>
                    <span className="font-mono">-${previewInvoice.amountPaid.toFixed(2)}</span>
                  </div>

                  <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-sm font-extrabold text-amber-700">
                    <span>Net Balance Due:</span>
                    <span className="font-mono">${previewInvoice.balanceDue.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="pt-6 border-t border-slate-200 space-y-3 text-[11px] text-slate-600">
                <span className="font-bold uppercase text-slate-800 block">Bank Settlement Coordinates:</span>
                <p className="whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[10px]">
                  {settings?.paymentInstructions}
                </p>

                <div className="pt-4 flex justify-between items-end text-[10px] text-slate-500">
                  <div>
                    <div className="border-b border-slate-400 w-48 mb-1" />
                    <span>Authorized Finance Signature: SaaSLink Ltd</span>
                  </div>
                  <div>
                    <span>Thank you for partnering with SaaSLink Technologies Ltd</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl text-left my-8 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-display font-bold text-white">
                  Issue Official Tax Invoice
                </h3>
                <p className="text-xs text-slate-400">
                  Generate an accounts receivable invoice with automated VAT calculation.
                </p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Client Account *</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 text-xs"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.company} ({c.name})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono uppercase text-cyan-400 font-bold tracking-wider">
                    Invoice Items & Deliverables
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-7">
                        <input
                          type="text"
                          required
                          placeholder="Scope milestone description..."
                          value={it.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={it.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400 text-center"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          min="0"
                          step="50"
                          placeholder="Unit Price"
                          value={it.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400 text-right"
                        />
                      </div>

                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Invoice Notes</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Tax / VAT (%):</span>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-16 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-right text-white font-mono"
                    />
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Tax Amount:</span>
                    <span className="font-mono text-white">${taxAmount.toFixed(2)}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                    <span>Total Amount:</span>
                    <span className="font-mono text-cyan-400">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  Issue & Dispatch Invoice
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
