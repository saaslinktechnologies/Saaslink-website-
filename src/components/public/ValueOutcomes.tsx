import React from 'react';
import { 
  Workflow, Cloud, Users, ArrowUpRight, 
  ShieldCheck, CheckCircle2, Zap
} from 'lucide-react';

interface ValueOutcomesProps {
  onScheduleScoping?: () => void;
}

export const ValueOutcomes: React.FC<ValueOutcomesProps> = ({ onScheduleScoping }) => {
  const capabilities = [
    {
      systemTag: 'Sector ERP & Custom Software',
      headline: 'Sector Softwares & Multi-Branch Systems',
      subhead: 'Tailored for Kenyan Corporates, Healthcare, Utilities & Faith Entities',
      description: 'Off-the-shelf software rarely fits African operational workflows. We construct hardened sector platforms — including the MASUMA ERP automotive distribution suite, RaphaMIS hospital core, Aura smart utility billing, PropCloud360 property management, EMIS school operations, and Ecclesiah church management.',
      deliverables: [
        'MASUMA ERP: Multi-warehouse stock sync, KRA eTIMS, branch sales POS',
        'RaphaMIS: Outpatient/Inpatient triage, clinical EHR, SHA/NHIF billing',
        'Aura Utilities: Smart water meter STS tokens & automated M-Pesa billing',
        'Ecclesiah & EMIS: Church tithes, school fee tracking & CBC grading',
      ],
      metric: '100% compliant with eTIMS, SHA & Kenya DPA 2019',
      icon: Workflow,
    },
    {
      systemTag: 'Manual Process Digitization',
      headline: 'Process Automation & Paperless Operations',
      subhead: 'Eliminating Paper Vouchers, Physical Books & Reconciliation Lag',
      description: 'Kenyan organizations lose millions every year to manual bookkeeping, misplaced paper receipt books, and days spent reconciling bank and M-Pesa statements. We convert manual procedures into seamless digital workflows with automated multi-level approvals and real-time ledger balancing.',
      deliverables: [
        'M-Pesa Daraja STK Push & automated Paybill/Till ledger reconciliation',
        'Digital requisition, purchase order approvals & biometric sign-offs',
        'Offline-first tablet survey and field inspection synchronizations',
        'Automated SMS payment receipts, parent notices, and tenant alerts',
      ],
      metric: 'Zero manual reconciliation errors; instant audit trail',
      icon: Zap,
    },
    {
      systemTag: 'Cloud & Performance Engineering',
      headline: 'Cloud Architecture & Systems Optimization',
      subhead: 'High-Speed Websites, Database Tuning & Zero Server Crashes',
      description: 'We build fast, secure corporate and institutional web portals that convert visitors into clients. For existing slow software, we diagnose database bottlenecks, optimize heavy SQL queries, eliminate server crashes during peak traffic, and migrate workloads to secure cloud infrastructure.',
      deliverables: [
        'High-performance web portals for corporates, NGOs & religious bodies',
        'Database indexing, slow query refactoring & MySQL/PostgreSQL tuning',
        'Cloud migration to AWS, Google Cloud or dedicated VPS with Docker',
        'Automated daily encrypted offsite backups & disaster recovery playbooks',
      ],
      metric: '< 90ms latency; 99.98% verified cloud uptime',
      icon: Cloud,
    },
  ];

  return (
    <section id="capabilities" className="py-24 bg-[oklch(0.26_0.038_165)] border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.85_0.12_80)]">
            Proven Engineering Scope
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight font-sans">
            Built for how Kenyan organizations <span className="text-gradient-gold">actually operate</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            From commercial enterprises and utility boards to non-profits and faith-based institutions, we deliver real software systems that eliminate paperwork, scale revenue, and run reliably every day.
          </p>
        </div>

        {/* 3-Column Bento Grid in Spruce & Gold */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {capabilities.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div 
                key={idx}
                className="group relative flex flex-col justify-between p-8 rounded-3xl bg-[oklch(0.32_0.045_165/0.7)] border border-white/10 hover:border-[oklch(0.78_0.12_78/0.4)] transition-all duration-300 hover:-translate-y-1 shadow-elegant backdrop-blur-md"
              >
                <div>
                  {/* System Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-semibold text-[oklch(0.85_0.12_80)]">
                      {item.systemTag}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center text-[oklch(0.85_0.12_80)] group-hover:scale-105 transition-transform">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Headline & Subhead */}
                  <h3 className="text-xl font-bold text-white group-hover:text-[oklch(0.85_0.12_80)] transition-colors leading-snug font-sans">
                    {item.headline}
                  </h3>
                  <p className="text-xs font-medium text-[oklch(0.78_0.12_78)] mt-1 mb-4">
                    {item.subhead}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed font-normal mb-6">
                    {item.description}
                  </p>

                  {/* Concrete Deliverables */}
                  <div className="space-y-2.5 pt-4 border-t border-white/10">
                    <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Concrete Deliverables:
                    </p>
                    {item.deliverables.map((del, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.85_0.12_80)] shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Metric Bottom Pill */}
                <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[oklch(0.85_0.12_80)] font-mono">
                    {item.metric}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[oklch(0.85_0.12_80)] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action strip in Spruce & Gold */}
        <div className="mt-14 p-6 rounded-2xl border border-white/10 bg-black/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-sm font-semibold text-white">
              Evaluating an architectural overhaul or greenfield software system?
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              We provide formal architecture assessments with estimated sprint allocations and fixed-price milestones.
            </p>
          </div>
          <button
            onClick={onScheduleScoping}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] px-5 py-3 text-xs font-bold text-[oklch(0.22_0.03_165)] shadow-gold transition-all hover:-translate-y-0.5 hover:brightness-105 cursor-pointer shrink-0"
          >
            <span>Schedule Scoping Session</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
