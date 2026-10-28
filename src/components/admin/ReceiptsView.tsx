import React, { useState } from 'react';
import { 
  Receipt, Search, Eye, Printer, CheckCircle2, 
  Calendar, Shield, CreditCard, ArrowUpRight 
} from 'lucide-react';
import { Payment, GlobalSettings } from '../../types.ts';

interface ReceiptsViewProps {
  payments?: Payment[];
  settings?: GlobalSettings;
}

export const ReceiptsView: React.FC<ReceiptsViewProps> = ({
  payments = [],
  settings,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const safePayments = payments || [];

  const filtered = safePayments.filter(p => {
    const term = searchTerm.toLowerCase();
    return (
      (p.receiptNumber || '').toLowerCase().includes(term) ||
      (p.clientCompany || '').toLowerCase().includes(term) ||
      (p.invoiceNumber || '').toLowerCase().includes(term) ||
      (p.reference || '').toLowerCase().includes(term)
    );
  });

  const totalCollected = safePayments.reduce((sum, p) => sum + p.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white">
            Official Payment Receipts Ledger
          </h2>
          <p className="text-xs text-slate-400">
            Audit trail of verified settlements, M-Pesa IPN transaction codes, and printable vouchers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search receipts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 w-52"
            />
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-mono text-xs font-bold">
            Total: ${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Receipt Number</th>
                <th className="py-3 px-4">Client / Account</th>
                <th className="py-3 px-4">Invoice Ref</th>
                <th className="py-3 px-4">Payment Channel</th>
                <th className="py-3 px-4">Reference / Code</th>
                <th className="py-3 px-4">Amount Paid</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No receipts recorded yet. Payments recorded on invoices will generate official vouchers here.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {p.receiptNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{p.clientCompany}</div>
                      <div className="text-[10px] text-slate-400">{p.paymentDate}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-cyan-400">
                      {p.invoiceNumber}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {p.method}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {p.reference}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                      ${p.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedPayment(p)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title="Print Official Receipt Voucher"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Branded Receipt Voucher Modal (Print-Ready) */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl text-left my-8 overflow-hidden print:m-0 print:w-full print:shadow-none">
            
            {/* Screen Controls */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold">Official Payment Voucher — {selectedPayment.receiptNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-slate-400 hover:text-white px-2 py-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Receipt Body */}
            <div className="p-8 sm:p-10 space-y-6 text-xs font-sans">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded bg-slate-950 text-cyan-400 flex items-center justify-center font-bold text-xs">
                      SL
                    </div>
                    <h1 className="text-lg font-bold tracking-tight text-slate-950">
                      SaaSLink Technologies Ltd
                    </h1>
                  </div>
                  <p className="text-slate-600 text-[10px] leading-snug">
                    {settings?.companyAddress || settings?.address || 'Delta Corner Tower, Westlands, Nairobi, Kenya'}<br />
                    PIN: {settings?.taxId || 'P051982341Z'} | Tel: {settings?.companyPhone || settings?.phone || '+254 720 000 000'}<br />
                    Email: {settings?.companyEmail || settings?.email || 'contact@saaslink.tech'}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xl font-extrabold tracking-tight text-emerald-700">
                    OFFICIAL RECEIPT
                  </div>
                  <p className="font-mono text-sm font-bold text-slate-800 mt-1">
                    {selectedPayment.receiptNumber}
                  </p>
                  <p className="text-slate-500 text-[10px] mt-1">
                    Date: {selectedPayment.paymentDate}
                  </p>
                </div>
              </div>

              {/* Settlement Summary Card */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Received With Thanks From:</span>
                    <span className="text-base font-bold text-slate-900">{selectedPayment.clientCompany}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Settlement Amount:</span>
                    <span className="text-2xl font-extrabold font-mono text-emerald-700">
                      ${selectedPayment.amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-700">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Applied to Invoice:</span>
                    <strong className="font-mono">{selectedPayment.invoiceNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Payment Method:</span>
                    <strong>{selectedPayment.method}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Transaction Code:</span>
                    <strong className="font-mono">{selectedPayment.reference}</strong>
                  </div>
                </div>
              </div>

              {selectedPayment.notes && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">Reconciliation Notes: </span>
                  {selectedPayment.notes}
                </div>
              )}

              {/* Signature & Assurance */}
              <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-[10px] text-slate-500">
                <div>
                  <div className="border-b border-slate-400 w-44 mb-1" />
                  <span>Authorized Finance Signature</span>
                  <div className="text-[9px] text-slate-400 mt-0.5">SaaSLink Technologies Ltd</div>
                </div>

                <div className="text-right">
                  <div className="px-2.5 py-1 rounded bg-slate-100 border border-slate-300 font-mono text-[9px] text-slate-600 inline-block">
                    VERIFIED PAYMENT VOUCHER
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
