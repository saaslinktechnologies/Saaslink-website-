import React, { useState } from 'react';
import { 
  FileText, Plus, Printer, CheckCircle, ArrowRight, 
  Trash2, Copy, Search, Eye, AlertCircle, Layers 
} from 'lucide-react';
import { Quotation, Client, GlobalSettings, QuotationItem } from '../../types.ts';

interface QuotationsViewProps {
  quotations?: Quotation[];
  clients?: Client[];
  settings?: GlobalSettings;
  onCreateQuotation: (data: any) => Promise<void>;
  onUpdateQuotation: (id: string, data: any) => Promise<void>;
  onConvertToInvoice: (id: string) => Promise<void>;
  initialClient?: Client | null;
}

export const QuotationsView: React.FC<QuotationsViewProps> = ({
  quotations = [],
  clients = [],
  settings,
  onCreateQuotation,
  onUpdateQuotation,
  onConvertToInvoice,
  initialClient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [builderOpen, setBuilderOpen] = useState(!!initialClient);
  const [previewQuote, setPreviewQuote] = useState<Quotation | null>(null);
  const safeQuotes = quotations || [];
  const safeClients = clients || [];

  // Form State for Quotation Builder
  const [clientId, setClientId] = useState(initialClient?.id || (safeClients[0]?.id || ''));
  const [issueDate, setIssueDate] = useState(new Date().toISOString().substring(0, 10));
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10));
  const [currency, setCurrency] = useState(settings?.currency || 'USD');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxRate, setTaxRate] = useState(settings?.defaultTaxRate || 16);
  const [notes, setNotes] = useState('Thank you for choosing SaaSLink Technologies Ltd. Quotation valid for 30 calendar days.');
  const [terms, setTerms] = useState(settings?.termsAndConditions || 'Payment: 40% advance on project commencement, 40% upon staging UAT demo, 20% on production deployment.');
  
  const [items, setItems] = useState<Omit<QuotationItem, 'id' | 'total'>[]>([
    { type: 'service', description: 'Enterprise Software Architecture & Custom Engineering', quantity: 1, unitPrice: 4800, discount: 0 },
    { type: 'database', description: 'MySQL 8.0 Relational Clustered Schema & Migration', quantity: 1, unitPrice: 1200, discount: 0 },
  ]);

  const filtered = safeQuotes.filter(q => {
    const matchesSearch = 
      (q.quotationNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.clientCompany || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate live totals
  const subtotal = items.reduce((sum, it) => sum + (it.quantity * it.unitPrice - (it.discount || 0)), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const subtotalAfterDisc = subtotal - discountAmount;
  const taxAmount = (subtotalAfterDisc * taxRate) / 100;
  const grandTotal = subtotalAfterDisc + taxAmount;

  const handleAddItem = () => {
    setItems([...items, { type: 'service', description: 'Service Deliverable', quantity: 1, unitPrice: 500, discount: 0 }]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateQuotation({
      clientId,
      issueDate,
      expiryDate,
      currency,
      items,
      discountPercent,
      taxRate,
      notes,
      terms,
      status: 'Sent',
    });
    setBuilderOpen(false);
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
            Quotations & Proposals Studio
          </h2>
          <p className="text-xs text-slate-400">
            Create, manage, and convert custom itemized quotation proposals into binding invoices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search quotes..."
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
            <option value="Accepted">Accepted</option>
            <option value="Converted to Invoice">Converted to Invoice</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button
            onClick={() => setBuilderOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Quotation</span>
          </button>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Quote Number</th>
                <th className="py-3 px-4">Client / Organization</th>
                <th className="py-3 px-4">Date & Validity</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No quotations found. Click "New Quotation" to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-cyan-400">
                      {quote.quotationNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{quote.clientCompany}</div>
                      <div className="text-[11px] text-slate-400">{quote.clientName}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200">{quote.issueDate}</div>
                      <div className="text-[11px] text-slate-500">Expires: {quote.expiryDate}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-base font-bold text-white">
                        ${quote.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-slate-400">Tax incl. ({quote.taxRate}%)</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                        quote.status === 'Converted to Invoice' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        quote.status === 'Accepted' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                        quote.status === 'Sent' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {quote.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewQuote(quote)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors"
                          title="View Official Quotation"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>View</span>
                        </button>

                        {quote.status !== 'Converted to Invoice' && (
                          <button
                            onClick={() => onConvertToInvoice(quote.id)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Convert to Official Invoice"
                          >
                            <span>Convert to Invoice</span>
                            <ArrowRight className="w-3 h-3" />
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

      {/* Quotation Builder Modal */}
      {builderOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl text-left my-8 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-display font-bold text-white">
                  Quotation Studio — Create Proposal
                </h3>
                <p className="text-xs text-slate-400">
                  Custom line-item pricing with automatic subtotal, discounts, and tax computation.
                </p>
              </div>
              <button
                onClick={() => setBuilderOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              
              {/* Client & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Client *</label>
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
                  <label className="block font-semibold text-slate-300 mb-1">Expiry Date (Locked Price)</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>
              </div>

              {/* Line Items Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono uppercase text-cyan-400 font-bold tracking-wider">
                    Itemized Deliverables & Pricing
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
                      <div className="col-span-6 sm:col-span-7">
                        <input
                          type="text"
                          required
                          placeholder="Scope deliverable description..."
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

                      <div className="col-span-3 sm:col-span-2">
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

              {/* Totals & Adjustments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Commercial Terms & Payment Milestones</label>
                    <textarea
                      rows={2}
                      value={terms}
                      onChange={(e) => setTerms(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Quotation Notes</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Commercial Discount (%):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="w-16 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-right text-white font-mono"
                    />
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-amber-400">
                      <span>Discount ({discountPercent}%):</span>
                      <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Tax / VAT Rate (%):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-16 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-right text-white font-mono"
                    />
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>VAT Amount:</span>
                    <span className="font-mono text-white">${taxAmount.toFixed(2)}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                    <span>Quotation Grand Total:</span>
                    <span className="font-mono text-cyan-400">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setBuilderOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  Save & Issue Official Quotation
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Official Branded Quotation Preview Modal (Print-Ready) */}
      {previewQuote && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-3xl shadow-2xl text-left my-8 overflow-hidden print:m-0 print:w-full print:shadow-none">
            
            {/* Modal Screen Controls (Hidden during print) */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold">Official Quotation Preview — {previewQuote.quotationNumber}</span>
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
                  onClick={() => setPreviewQuote(null)}
                  className="text-slate-400 hover:text-white px-2 py-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Print Document Body */}
            <div className="p-8 sm:p-12 space-y-8 text-xs font-sans">
              
              {/* Document Header */}
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
                    QUOTATION
                  </div>
                  <p className="font-mono text-sm font-bold text-slate-800 mt-1">
                    {previewQuote.quotationNumber}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Date: {previewQuote.issueDate}<br />
                    Valid Until: {previewQuote.expiryDate}
                  </p>
                </div>
              </div>

              {/* Client Box */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Quotation Prepared For:</span>
                  <div className="font-bold text-sm text-slate-900">{previewQuote.clientCompany}</div>
                  <div className="text-slate-700">{previewQuote.clientName}</div>
                  <div className="text-slate-600">{previewQuote.clientEmail}</div>
                  {previewQuote.clientAddress && <div className="text-slate-600">{previewQuote.clientAddress}</div>}
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Engagement Terms:</span>
                  <div className="text-slate-700">Currency: <strong>{previewQuote.currency}</strong></div>
                  <div className="text-slate-700">Price Validity: <strong>30 Calendar Days</strong></div>
                  <div className="text-slate-700">Tax Status: <strong>VAT Applicable ({previewQuote.taxRate}%)</strong></div>
                </div>
              </div>

              {/* Itemized Table */}
              <div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-900 text-[11px] font-bold uppercase text-slate-700">
                      <th className="py-2.5">Scope Item / Description</th>
                      <th className="py-2.5 text-center">Qty</th>
                      <th className="py-2.5 text-right">Unit Price</th>
                      <th className="py-2.5 text-right">Total ({previewQuote.currency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {(previewQuote.items || []).map((item, idx) => (
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

              {/* Financial Calculation Box */}
              <div className="flex justify-end pt-4">
                <div className="w-72 space-y-2 border-t border-slate-300 pt-3 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold">${previewQuote.subtotal.toFixed(2)}</span>
                  </div>

                  {previewQuote.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount ({previewQuote.discountPercent}%):</span>
                      <span className="font-mono">-${previewQuote.discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>VAT / Tax ({previewQuote.taxRate}%):</span>
                    <span className="font-mono font-semibold">${previewQuote.taxAmount.toFixed(2)}</span>
                  </div>

                  <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-sm font-bold text-slate-950">
                    <span>Total Investment:</span>
                    <span className="font-mono">${previewQuote.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Terms & Bank Details */}
              <div className="pt-6 border-t border-slate-200 space-y-4 text-[11px] text-slate-600">
                <div>
                  <span className="font-bold uppercase text-slate-800 block mb-1">Commercial Terms & Acceptance:</span>
                  <p>{previewQuote.terms}</p>
                </div>

                <div>
                  <span className="font-bold uppercase text-slate-800 block mb-1">Settlement Instructions:</span>
                  <p className="whitespace-pre-line">{settings.paymentInstructions}</p>
                </div>

                <div className="pt-8 flex justify-between items-end text-[10px] text-slate-500">
                  <div>
                    <div className="border-b border-slate-400 w-48 mb-1" />
                    <span>Authorized Signature: SaaSLink Technologies Ltd</span>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 w-48 mb-1" />
                    <span>Client Acceptance & Confirmation</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
