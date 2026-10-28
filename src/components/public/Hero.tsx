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
  const [activeSystem, setActiveSystem] = useState<'masuma' | 'raphamis' | 'aura' | 'ecclesiah'>('masuma');

  const systemPreviews = {
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
    <section className="relative overflow-hidden bg-gradient-to-b from-[oklch(0.30_0.04_165)] via-[oklch(0.28_0.038_165)] to-[oklch(0.25_0.035_165)] pt-12 pb-20 md:pt-18 md:pb-28 border-b border-white/10">
      
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Authoritative Editorial Positioning with Gold Brand Kit */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Professional Subtitle Kicker in Brand Gold */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[oklch(0.85_0.12_80)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.85_0.12_80)] animate-pulse" />
              <span>Enterprise Software Architecture · Nairobi, Kenya</span>
            </div>

            {/* Main Headline with Signature Gold Gradient */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white tracking-tight leading-[1.1] font-sans">
              We engineer software systems that power African enterprises, <span className="text-gradient-gold">institutions and non-profits.</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              From multi-branch ERPs with native KRA eTIMS and hospital EHRs with SHA/NHIF reconciliation to smart water utility IoT and manual process automation. SaaSLink Technologies builds resilient, production-grade software platforms tailored to how regional organizations actually operate.
            </p>

            {/* Regulatory & Standards Strip */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300 pt-1">
              <span className="text-[oklch(0.85_0.12_80)] font-medium">✓ KRA eTIMS Validated</span>
              <span className="text-white/20">·</span>
              <span className="text-[oklch(0.85_0.12_80)] font-medium">✓ M-Pesa Daraja 2.0 Native</span>
              <span className="text-white/20">·</span>
              <span className="text-[oklch(0.85_0.12_80)] font-medium">✓ SHA / NHIF Integrated</span>
              <span className="text-white/20">·</span>
              <span className="text-slate-300">✓ Kenya Data Protection Act 2019</span>
            </div>

            {/* High-Intent Conversion CTAs in Signature Gold */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenQuoteModal()}
                className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-bold px-6 py-3.5 text-sm transition-all shadow-gold hover:-translate-y-0.5 cursor-pointer hover:brightness-105"
              >
                <span>Schedule Architecture Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateSection('solutions')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 hover:border-[oklch(0.78_0.12_78/0.5)] bg-white/5 hover:bg-white/10 text-white px-5 py-3.5 text-sm font-medium transition-all cursor-pointer"
              >
                <span>Explore 7 Sector Softwares</span>
              </button>
            </div>

            {/* Verifiable Production Metrics */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-2xl font-bold text-white font-sans">7 Platforms</p>
                <p className="text-xs text-slate-400 mt-0.5">Production Deployed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gradient-gold font-sans">100%</p>
                <p className="text-xs text-slate-400 mt-0.5">IP & Source Code Ownership</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-sans">99.98%</p>
                <p className="text-xs text-slate-400 mt-0.5">Production Uptime SLA</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gradient-gold font-sans">Zero</p>
                <p className="text-xs text-slate-400 mt-0.5">Paper & Manual Reconciliation Lag</p>
              </div>
            </div>

          </div>

          {/* Right Column: Architectural Interactive Showcase in Brand Spruce Glass */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-[oklch(0.32_0.045_165/0.8)] border border-white/15 shadow-elegant p-6 sm:p-7 relative overflow-hidden backdrop-blur-md">
              
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
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-black/25 border border-white/10 mb-5">
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
                    <div key={sIdx} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-none">
                      <span className="text-slate-400">{spec.label}</span>
                      <span className="font-semibold text-slate-200 text-right">{spec.val}</span>
                    </div>
                  ))}
                </div>

                {/* Production Impact Metric */}
                <div className="p-3 rounded-xl bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-between text-xs text-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[oklch(0.85_0.12_80)] shrink-0" />
                    <span>{currentPreview.metrics}</span>
                  </div>
                  <button 
                    onClick={() => onNavigateSection('solutions')}
                    className="hover:text-[oklch(0.85_0.12_80)] transition-colors cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Callout */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Want a walkthrough of this architecture?</span>
                  <button
                    onClick={() => onOpenQuoteModal(`Architecture deep-dive: ${currentPreview.name}`)}
                    className="font-semibold text-[oklch(0.85_0.12_80)] hover:text-white transition-colors cursor-pointer"
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
