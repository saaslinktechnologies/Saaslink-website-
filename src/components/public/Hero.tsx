import React, { useState } from 'react';
import { 
  ArrowRight, ShieldCheck, Database, Cpu, 
  CheckCircle2, Building2, HeartPulse, Droplets, 
  Church, ArrowUpRight, Server, Layers, Lock,
  FileCheck2, Activity, Zap
} from 'lucide-react';
import { GlobalSettings } from '../../types.ts';

interface HeroProps {
  settings?: GlobalSettings;
  onOpenQuoteModal: (service?: string) => void;
  onExploreWork: () => void;
  onExploreServices: () => void;
  onNavigateSection: (section: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onOpenQuoteModal,
  onExploreWork,
  onExploreServices,
  onNavigateSection,
}) => {
  const [activeSystem, setActiveSystem] = useState<'propcloud' | 'pijoshop' | 'masuma' | 'raphamis' | 'aura' | 'ecclesiah'>('propcloud');

  const systemPreviews = {
    propcloud: {
      name: 'PropCloud360 Property System',
      sector: 'Real Estate & Multi-Unit Plazas',
      headline: 'Automated M-Pesa Rent Collection & Landlord Payouts',
      description: 'Commercial and residential real estate operating engine. Automates lease agreements, monthly SMS rent demands, instant M-Pesa Paybill matching, tenant maintenance ticketing, and multi-owner remittance statements.',
      specs: [
        { label: 'Rent Reconciliation', val: 'Instant M-Pesa Paybill / C2B Matching' },
        { label: 'Lease & Tenants', val: 'Digital Agreements, SMS Reminders & Arrears Aging' },
        { label: 'Owner Remittances', val: 'One-Click Net Payout Statements with Commission' },
      ],
      metrics: '88% drop in late rent arrears across 15,000+ units',
    },
    pijoshop: {
      name: 'Pijo Shop (app.pijo.shop)',
      sector: 'Footwear & Fashion Retail SMEs',
      headline: 'Shoe Variant Matrix, Barcode POS & Marketplace',
      description: 'Tailored specifically for footwear and fashion retailers. Manages matrix variants (sizes 35-46, half-sizes, widths, colors), unifies physical boutique inventory with the online marketplace at app.pijo.shop, and automates WhatsApp receipts.',
      specs: [
        { label: 'Matrix Variants', val: 'Footwear Sizes (35-46), Widths & Colorways' },
        { label: 'Omnichannel POS', val: 'Boutique Shelf & app.pijo.shop Sync' },
        { label: 'Courier Logistics', val: 'Automated Rider Waybills & WhatsApp Dispatch Links' },
      ],
      metrics: '100% live inventory accuracy; 85% faster reconciliation',
    },
    masuma: {
      name: 'MASUMA ERP System',
      sector: 'Automotive Distribution & Wholesale',
      headline: 'Multi-Branch Inventory & KRA eTIMS Integration',
      description: 'Synchronizes multi-warehouse stock in real time, manages wholesale branch POS, lookups chassis/VIN fitments, and generates cryptographic KRA eTIMS tax invoices.',
      specs: [
        { label: 'Regulatory Mandate', val: 'Native KRA eTIMS Cryptographic QR' },
        { label: 'Stock Reconciled', val: 'Multi-Warehouse & Showroom POS' },
        { label: 'Payment Gateway', val: 'Direct M-Pesa B2B / C2B Settlement' },
      ],
      metrics: '35 hours saved weekly in stock reconciliation',
    },
    raphamis: {
      name: 'RaphaMIS Hospital Core',
      sector: 'Hospitals, Clinics & Mission Facilities',
      headline: 'Electronic Health Records & SHA/NHIF Claims',
      description: 'Comprehensive hospital management unifying digital outpatient triage, inpatient bed occupancy, doctor consultation notes, digital pharmacy POS, and SHA insurance claims.',
      specs: [
        { label: 'Insurance Gateway', val: 'Real-Time SHA / NHIF Electronic Claims' },
        { label: 'Clinical Flow', val: 'Paperless Triage, Lab LIMS & Doctor Notes' },
        { label: 'Pharmacy Control', val: 'Batch Expiry & Automated Stock Ledger' },
      ],
      metrics: 'Zero lost patient records; instant claim audits',
    },
    aura: {
      name: 'Aura Utility Management',
      sector: 'Water Service Providers & Municipalities',
      headline: 'Prepaid Smart Metering & Automated Revenue',
      description: 'IoT telemetry platform for water and power utilities. Handles automated M-Pesa token vending, automated valve shutoffs for delinquent accounts, and non-revenue water containment.',
      specs: [
        { label: 'Meter Protocol', val: 'STS Smart Prepaid & AMR Telemetry' },
        { label: 'Token Vending', val: 'Automated M-Pesa Instant STS Token SMS' },
        { label: 'Revenue Assurance', val: 'Non-Revenue Water (NRW) Anomaly Alerts' },
      ],
      metrics: '99.4% automated payment to token turnaround',
    },
    ecclesiah: {
      name: 'Ecclesiah & Haki Hali Systems',
      sector: 'Religious Dioceses, NGOs & Civic Bodies',
      headline: 'Parish Stewardship & Public Governance Transparency',
      description: 'Faith and non-profit administration systems for membership directories, automated Sunday tithes and sadaka M-Pesa Paybill matching, harambee building funds, and donor M&E metrics.',
      specs: [
        { label: 'Giving Automation', val: 'Instant M-Pesa Paybill Tithe Reconciliation' },
        { label: 'Special Projects', val: 'Building Pledge (Harambee) Tracking' },
        { label: 'Transparency', val: 'Granular Audit Logs & Ministry Reporting' },
      ],
      metrics: '100% auditable donor & tithe ledgers',
    },
  };

  const currentPreview = systemPreviews[activeSystem];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[oklch(0.30_0.04_165)] via-[oklch(0.28_0.038_165)] to-[oklch(0.25_0.035_165)] pt-8 sm:pt-12 pb-14 sm:pb-20 md:pt-18 md:pb-28 border-b border-white/10">
      
      {/* Signature warm gold ambient glows */}
      <div 
        className="pointer-events-none absolute -top-40 -right-40 h-[650px] w-[650px] rounded-full blur-3xl opacity-15 bg-[oklch(0.78_0.12_78)]" 
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none absolute -bottom-32 -left-20 h-[450px] w-[450px] rounded-full blur-3xl opacity-10 bg-[oklch(0.78_0.12_78)]" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Authoritative Editorial Positioning with Gold Brand Kit */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Professional Subtitle Kicker in Brand Gold */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[oklch(0.85_0.12_80)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.85_0.12_80)] animate-pulse shrink-0" />
              <span className="truncate">Enterprise Software Architecture · Nairobi, Kenya</span>
            </div>

            {/* Main Headline with Signature Gold Gradient */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white tracking-tight leading-[1.15] sm:leading-[1.1] font-sans break-words">
              We engineer software systems that power African enterprises, <span className="text-gradient-gold">institutions and non-profits.</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              From multi-branch ERPs with native KRA eTIMS and hospital EHRs with SHA/NHIF reconciliation to smart water utility IoT and manual process automation. SaaSLink Technologies builds resilient, production-grade software platforms tailored to how regional organizations actually operate.
            </p>

            {/* Regulatory & Standards Strip */}
            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 text-xs text-slate-300 pt-1">
              <span className="text-[oklch(0.85_0.12_80)] font-medium">✓ KRA eTIMS Validated</span>
              <span className="text-white/20 hidden sm:inline">·</span>
              <span className="text-[oklch(0.85_0.12_80)] font-medium">✓ M-Pesa Daraja 2.0 Native</span>
              <span className="text-white/20 hidden sm:inline">·</span>
              <span className="text-[oklch(0.85_0.12_80)] font-medium">✓ SHA / NHIF Integrated</span>
              <span className="text-white/20 hidden sm:inline">·</span>
              <span className="text-slate-300">✓ Kenya Data Protection Act 2019</span>
            </div>

            {/* High-Intent Conversion CTAs in Signature Gold */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5">
              <button
                onClick={() => onOpenQuoteModal()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-semibold px-4.5 py-2.5 text-xs sm:text-sm transition-all shadow-gold hover:-translate-y-0.5 cursor-pointer hover:brightness-105 text-center"
              >
                <span>Schedule Consultation</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                onClick={() => onNavigateSection('solutions')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 hover:border-[oklch(0.78_0.12_78/0.5)] bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 text-xs sm:text-sm font-medium transition-all cursor-pointer text-center"
              >
                <span>Explore 7 Sector Softwares</span>
              </button>
            </div>

            {/* Verifiable Production Metrics */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 sm:border-0 sm:p-0 sm:bg-transparent">
                <p className="text-2xl font-bold text-white font-sans">7 Platforms</p>
                <p className="text-xs text-slate-400 mt-0.5">Production Deployed</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 sm:border-0 sm:p-0 sm:bg-transparent">
                <p className="text-2xl font-bold text-gradient-gold font-sans">100%</p>
                <p className="text-xs text-slate-400 mt-0.5">IP & Source Ownership</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 sm:border-0 sm:p-0 sm:bg-transparent">
                <p className="text-2xl font-bold text-white font-sans">99.98%</p>
                <p className="text-xs text-slate-400 mt-0.5">Production Uptime SLA</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 sm:border-0 sm:p-0 sm:bg-transparent">
                <p className="text-2xl font-bold text-gradient-gold font-sans">Zero</p>
                <p className="text-xs text-slate-400 mt-0.5">Reconciliation Lag</p>
              </div>
            </div>

          </div>

          {/* Right Column: Architectural Interactive Showcase in Brand Spruce Glass */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl sm:rounded-3xl bg-[oklch(0.32_0.045_165/0.8)] border border-white/15 shadow-elegant p-5 sm:p-7 relative overflow-hidden backdrop-blur-md">
              
              {/* Top System Switcher Tabs */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[oklch(0.85_0.12_80)] block">
                    Enterprise Blueprint
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    Production Systems Architecture
                  </h3>
                </div>
                <div className="w-2 h-2 rounded-full bg-[oklch(0.85_0.12_80)]" />
              </div>

              {/* Selector segmented buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 rounded-xl bg-black/25 border border-white/10 mb-5">
                <button
                  onClick={() => setActiveSystem('propcloud')}
                  className={`py-2 px-1 text-[11px] rounded-lg transition-all text-center cursor-pointer ${
                    activeSystem === 'propcloud'
                      ? 'bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-bold shadow-gold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  PropCloud
                </button>
                <button
                  onClick={() => setActiveSystem('pijoshop')}
                  className={`py-2 px-1 text-[11px] rounded-lg transition-all text-center cursor-pointer ${
                    activeSystem === 'pijoshop'
                      ? 'bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-bold shadow-gold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Pijo Shop
                </button>
                <button
                  onClick={() => setActiveSystem('masuma')}
                  className={`py-2 px-1 text-[11px] rounded-lg transition-all text-center cursor-pointer ${
                    activeSystem === 'masuma'
                      ? 'bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-bold shadow-gold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  MASUMA
                </button>
                <button
                  onClick={() => setActiveSystem('raphamis')}
                  className={`py-2 px-1 text-[11px] rounded-lg transition-all text-center cursor-pointer ${
                    activeSystem === 'raphamis'
                      ? 'bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-bold shadow-gold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  RaphaMIS
                </button>
                <button
                  onClick={() => setActiveSystem('aura')}
                  className={`py-2 px-1 text-[11px] rounded-lg transition-all text-center cursor-pointer ${
                    activeSystem === 'aura'
                      ? 'bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-bold shadow-gold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Aura
                </button>
                <button
                  onClick={() => setActiveSystem('ecclesiah')}
                  className={`py-2 px-1 text-[11px] rounded-lg transition-all text-center cursor-pointer ${
                    activeSystem === 'ecclesiah'
                      ? 'bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-bold shadow-gold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Ecclesiah
                </button>
              </div>

              {/* System Details Display Card */}
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-semibold text-[oklch(0.85_0.12_80)]">
                    {currentPreview.sector}
                  </span>
                  <h4 className="text-lg font-bold text-white mt-0.5">
                    {currentPreview.name}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2 font-normal">
                    {currentPreview.description}
                  </p>
                </div>

                {/* Technical Specifications Specs Block */}
                <div className="p-4 rounded-xl bg-black/25 border border-white/10 space-y-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[oklch(0.85_0.12_80)]">
                    Technical & Integration Architecture
                  </p>
                  {currentPreview.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 text-xs py-1.5 border-b border-white/5 last:border-none">
                      <span className="text-slate-400">{spec.label}</span>
                      <span className="font-semibold text-slate-200 sm:text-right">{spec.val}</span>
                    </div>
                  ))}
                </div>

                {/* Production Impact Metric */}
                <div className="p-3 rounded-xl bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-between gap-2 text-xs text-slate-100">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-[oklch(0.85_0.12_80)] shrink-0" />
                    <span className="truncate">{currentPreview.metrics}</span>
                  </div>
                  <button 
                    onClick={() => onNavigateSection('solutions')}
                    className="p-1 hover:text-[oklch(0.85_0.12_80)] transition-colors cursor-pointer shrink-0"
                    aria-label="Navigate to solutions"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Callout */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="text-slate-400">Want a walkthrough of this architecture?</span>
                  <button
                    onClick={() => onOpenQuoteModal(`Architecture deep-dive: ${currentPreview.name}`)}
                    className="font-semibold text-[oklch(0.85_0.12_80)] hover:text-white transition-colors cursor-pointer text-left sm:text-right"
                  >
                    Book Walkthrough →
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
