import React, { useState } from 'react';
import { 
  X, Check, Calculator, ArrowRight, ShieldCheck, 
  Database, Layers, Send, Sparkles, AlertCircle 
} from 'lucide-react';
import { GlobalSettings } from '../../types.ts';

interface QuotationPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GlobalSettings;
  preselectedService?: string;
}

export const QuotationPlannerModal: React.FC<QuotationPlannerModalProps> = ({
  isOpen,
  onClose,
  settings,
  preselectedService = '',
}) => {
  if (!isOpen) return null;

  const [systemType, setSystemType] = useState<string>(preselectedService || 'PropCloud360 Property Management');
  const [databaseTier, setDatabaseTier] = useState<string>('MySQL 8 Clustered (High Availability)');
  const [platforms, setPlatforms] = useState<string[]>(['Responsive Web Application', 'REST API Engine']);
  const [integrations, setIntegrations] = useState<string[]>(['M-Pesa Daraja IPN Automated Billing', 'KRA eTIMS Tax Compliance']);
  const [slaTier, setSlaTier] = useState<string>('Standard Enterprise (99.9% Uptime)');

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compute ballpark estimate based on selections
  const computeEstimate = () => {
    let base = 3500; // USD baseline
    if (systemType.includes('ERP') || systemType.includes('MASUMA')) base += 2500;
    if (systemType.includes('Hospital') || systemType.includes('RaphaMIS')) base += 3000;
    if (systemType.includes('School') || systemType.includes('EMIS')) base += 1800;
    if (systemType.includes('PropCloud')) base += 2200;
    if (systemType.includes('Pijo Shop')) base += 1900;

    base += platforms.length * 800;
    base += integrations.length * 600;
    if (databaseTier.includes('Clustered')) base += 900;
    if (slaTier.includes('24/7')) base += 1200;

    const minUsd = Math.round(base * 0.85 / 100) * 100;
    const maxUsd = Math.round(base * 1.25 / 100) * 100;

    // Convert to KSh approximately (130 KES/USD)
    const minKes = (minUsd * 130).toLocaleString();
    const maxKes = (maxUsd * 130).toLocaleString();

    return { minUsd, maxUsd, minKes, maxKes };
  };

  const estimate = computeEstimate();

  const togglePlatform = (p: string) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]);
  };

  const toggleIntegration = (i: string) => {
    setIntegrations(prev => prev.includes(i) ? prev.filter(item => item !== i) : [...prev, i]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const message = `Interactive Quotation Planner Request:
- System Architecture: ${systemType}
- Database Tier: ${databaseTier}
- Target Interfaces: ${platforms.join(', ')}
- Core Integrations: ${integrations.join(', ')}
- SLA Support Tier: ${slaTier}
- Calculated Budget Range: $${estimate.minUsd.toLocaleString()} - $${estimate.maxUsd.toLocaleString()} (approx. KSh ${estimate.minKes} - ${estimate.maxKes})
- Additional Project Notes: ${notes || 'None'}`;

    try {
      const res = await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: clientName,
          email: clientEmail,
          phone: clientPhone,
          company: clientCompany,
          serviceOfInterest: systemType,
          budgetRange: `$${estimate.minUsd} - $${estimate.maxUsd}`,
          timeline: '1 - 3 Months',
          message,
          type: 'quote',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit quote request');

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-[oklch(0.24_0.035_165)] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-left my-4 sm:my-8">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-7 border-b border-white/10 bg-black/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center text-[oklch(0.85_0.12_80)] shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-sans">
                Project Scope & Architectural Quotation Planner
              </h2>
              <p className="text-xs text-slate-300">
                Configure technical requirements to generate an instant estimate and formal proposal request.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {submitted ? (
          <div className="p-6 sm:p-12 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 mx-auto">
              <Check className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white font-sans">
              Official Quotation Request Received
            </h3>

            <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
              Thank you, <strong className="text-white">{clientName}</strong>. Our enterprise software architects have received your technical specifications for <strong className="text-[oklch(0.85_0.12_80)]">{systemType}</strong>. We are generating a formal itemized quotation with locked pricing.
            </p>

            <div className="p-4 rounded-xl bg-black/30 border border-white/10 max-w-md mx-auto text-xs text-slate-300 space-y-1">
              <div>A copy of this proposal envelope has been queued for: <strong className="text-[oklch(0.85_0.12_80)]">{clientEmail}</strong></div>
              <div>Estimated Delivery Window: <strong className="text-white">Within 24 business hours</strong></div>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-bold text-xs shadow-gold min-h-[44px]"
              >
                Close Planner
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6 sm:space-y-8 max-h-[80vh] overflow-y-auto">
            
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1: System Type */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-[oklch(0.85_0.12_80)] font-bold block">
                01. Select Primary System Architecture
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {[
                  'PropCloud360 Property Management',
                  'Pijo Shop Footwear POS (app.pijo.shop)',
                  'MASUMA ERP Multi-Branch & eTIMS',
                  'RaphaMIS Hospital Core & SHA Claims',
                  'Aura Utility Prepaid Water Metering',
                  'EMIS CBC School & Fee Management',
                  'Ecclesiah Church & Diocese System',
                  'Haki Hali Civic Transparency & M&E',
                  'Custom Enterprise System Architecture',
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSystemType(type)}
                    className={`p-3 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer min-h-[44px] flex items-center justify-between ${
                      systemType === type
                        ? 'bg-[oklch(0.78_0.12_78/0.2)] border-[oklch(0.85_0.12_80)] text-white shadow-gold font-semibold'
                        : 'bg-black/30 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span className="truncate pr-2">{type}</span>
                    {systemType === type && <Check className="w-3.5 h-3.5 text-[oklch(0.85_0.12_80)] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Database Layer */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-[oklch(0.85_0.12_80)] font-bold block">
                02. Relational Database & Persistence Strategy
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  'MySQL 8 Clustered (High Availability)',
                  'MySQL Single Dedicated Instance',
                  'PostgreSQL Relational Engine',
                ].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setDatabaseTier(tier)}
                    className={`p-3 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer min-h-[44px] flex items-center justify-between ${
                      databaseTier === tier
                        ? 'bg-[oklch(0.78_0.12_78/0.2)] border-[oklch(0.85_0.12_80)] text-white shadow-gold font-semibold'
                        : 'bg-black/30 border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{tier}</span>
                    {databaseTier === tier && <Check className="w-3.5 h-3.5 text-[oklch(0.85_0.12_80)] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Interfaces & Platforms */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-[oklch(0.85_0.12_80)] font-bold block">
                03. Target Interfaces & Platforms
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  'Responsive Web Application',
                  'Admin Management Dashboard',
                  'REST API Engine',
                  'Customer / Client Portal',
                  'Mobile Companion (PWA)',
                  'Offline Field Sync',
                  'Automated PDF Reports',
                  'SMS Gateway Notifications',
                ].map((plat) => {
                  const active = platforms.includes(plat);
                  return (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => togglePlatform(plat)}
                      className={`p-2.5 rounded-xl text-xs border text-left transition-all cursor-pointer min-h-[44px] flex items-center justify-between ${
                        active
                          ? 'bg-[oklch(0.78_0.12_78/0.2)] border-[oklch(0.85_0.12_80)] text-white font-semibold'
                          : 'bg-black/30 border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className="truncate pr-1">{plat}</span>
                      {active && <Check className="w-3 h-3 text-[oklch(0.85_0.12_80)] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Integrations */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-[oklch(0.85_0.12_80)] font-bold block">
                04. Key Integrations & Regulatory Protocols
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  'M-Pesa Daraja IPN Automated Billing',
                  'KRA eTIMS Tax Compliance',
                  'SHA / NHIF Insurance Claims',
                  'STS Smart Prepaid Meter Tokens',
                  'Biometric & RFID Attendance',
                  'WhatsApp Business API Alerts',
                ].map((integ) => {
                  const active = integrations.includes(integ);
                  return (
                    <button
                      key={integ}
                      type="button"
                      onClick={() => toggleIntegration(integ)}
                      className={`p-2.5 rounded-xl text-xs border text-left transition-all cursor-pointer min-h-[44px] flex items-center justify-between ${
                        active
                          ? 'bg-[oklch(0.78_0.12_78/0.2)] border-[oklch(0.85_0.12_80)] text-white font-semibold'
                          : 'bg-black/30 border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className="truncate pr-1">{integ}</span>
                      {active && <Check className="w-3 h-3 text-[oklch(0.85_0.12_80)] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ballpark Investment Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/15 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase text-[oklch(0.85_0.12_80)] font-semibold">
                    Preliminary Investment Envelope
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold text-white mt-1 font-sans">
                    ${estimate.minUsd.toLocaleString()} – ${estimate.maxUsd.toLocaleString()}{' '}
                    <span className="text-xs text-slate-300 font-normal">
                      (approx. KSh {estimate.minKes} – {estimate.maxKes})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Includes technical specifications, database schema, unit testing, source code IP transfer, and 90-day post-launch warranty.
                  </p>
                </div>

                <div className="sm:text-right shrink-0">
                  <div className="px-3 py-1.5 rounded-lg bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] text-[oklch(0.85_0.12_80)] text-xs font-semibold inline-block">
                    100% Client IP Ownership
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Contact Credentials */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <label className="text-xs font-mono uppercase tracking-wider text-[oklch(0.85_0.12_80)] font-bold block">
                05. Client Organization & Delivery Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Christine Wangari"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[oklch(0.85_0.12_80)] min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="c.wangari@company.co.ke"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[oklch(0.85_0.12_80)] min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Strathridge Enterprises Ltd"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[oklch(0.85_0.12_80)] min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="+254 7XX XXX XXX"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[oklch(0.85_0.12_80)] min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Specific Constraints or Legacy Systems</label>
                <textarea
                  rows={2}
                  placeholder="Any timeline deadline, regulatory compliance, or legacy databases to migrate..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[oklch(0.85_0.12_80)] resize-none"
                />
              </div>
            </div>

            {/* Submission Action */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white border border-white/10 sm:border-transparent min-h-[44px] flex items-center justify-center transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-bold text-xs shadow-gold transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
              >
                {loading ? (
                  <span>Generating Architectural Proposal...</span>
                ) : (
                  <>
                    <span>Submit & Request Formal Itemized Quotation</span>
                    <Send className="w-3.5 h-3.5 shrink-0" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
