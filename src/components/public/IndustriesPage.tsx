import React, { useState } from 'react';
import { 
  GraduationCap, Activity, Landmark, Building2, 
  ShoppingBag, Truck, Globe, Briefcase, ArrowRight, 
  CheckCircle2, ChevronRight, Shield, Zap, 
  Layers, ExternalLink, X, PhoneCall, Sparkles
} from 'lucide-react';
import { Industry, GlobalSettings } from '../../types.ts';
import { INDUSTRIES_DATA, CORE_METRICS } from '../../data/nexusData.ts';

interface IndustriesPageProps {
  settings?: GlobalSettings;
  onRequestQuote: (industryName?: string) => void;
  onNavigateSection: (page: string) => void;
}

export const IndustriesPage: React.FC<IndustriesPageProps> = ({
  settings,
  onRequestQuote,
  onNavigateSection,
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);

  const getIndustryIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="h-6 w-6" />;
      case 'Activity':
        return <Activity className="h-6 w-6" />;
      case 'Landmark':
        return <Landmark className="h-6 w-6" />;
      case 'Building2':
        return <Building2 className="h-6 w-6" />;
      case 'ShoppingBag':
        return <ShoppingBag className="h-6 w-6" />;
      case 'Truck':
        return <Truck className="h-6 w-6" />;
      case 'Globe':
        return <Globe className="h-6 w-6" />;
      case 'Briefcase':
      default:
        return <Briefcase className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.32_0.04_165)] text-slate-100">
      
      {/* Breadcrumb & Hero Header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-[oklch(0.36_0.045_165)] to-[oklch(0.32_0.04_165)] pt-8 pb-16">
        <div className="container-x">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <button 
              onClick={() => onNavigateSection('home')} 
              className="hover:text-gold transition-colors"
            >
              Home
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-gold font-semibold">Industries</span>
          </nav>

          {/* Eyebrow and Page Title */}
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">Industries</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
              Sectors we <span className="text-gradient-gold">know deeply</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
              Our teams have spent years shipping software into these industries — so we ask sharper questions and ship faster from day one.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl border border-white/10 bg-[oklch(0.36_0.045_165/0.6)] backdrop-blur-md">
            {CORE_METRICS.map((metric, i) => (
              <div key={i} className="text-center px-2 py-1 border-r last:border-r-0 border-white/10">
                <p className="font-display text-2xl sm:text-3xl font-bold text-gradient-gold">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs text-slate-400 tracking-wider uppercase">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Main Sectors Grid */}
      <section className="container-x py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Core Industry Practice Areas
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Select an industry to explore tailored solutions, case studies, and compliance frameworks.
            </p>
          </div>
          <button
            onClick={() => onRequestQuote()}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] px-4 py-2.5 text-xs font-semibold text-[oklch(0.22_0.03_165)] shadow-gold transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Request Industry Assessment</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* 8 Industry Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES_DATA.map((ind) => (
            <article
              key={ind.id}
              onClick={() => setSelectedIndustry(ind)}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[oklch(0.36_0.045_165/0.6)] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[oklch(0.78_0.12_78/0.6)] hover:shadow-elegant cursor-pointer backdrop-blur-sm"
            >
              <div>
                {/* Icon */}
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[oklch(0.78_0.12_78/0.15)] text-[oklch(0.78_0.12_78)] transition-colors group-hover:bg-[oklch(0.78_0.12_78)] group-hover:text-[oklch(0.22_0.03_165)]">
                  {getIndustryIcon(ind.iconName)}
                </div>

                {/* Name & Short Description */}
                <h3 className="text-xl font-bold text-white group-hover:text-[oklch(0.85_0.12_80)] transition-colors">
                  {ind.name}
                </h3>
                <p className="mt-2 text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {ind.desc}
                </p>

                {/* Subsectors pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {ind.subsectors.slice(0, 2).map((sub, sIdx) => (
                    <span 
                      key={sIdx}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10"
                    >
                      {sub}
                    </span>
                  ))}
                  {ind.subsectors.length > 2 && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                      +{ind.subsectors.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[oklch(0.78_0.12_78)] font-semibold">
                <span className="group-hover:underline">Explore Architecture</span>
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Deep-Dive Sector Modal */}
      {selectedIndustry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-up">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[oklch(0.78_0.12_78/0.4)] bg-[oklch(0.34_0.045_165)] p-6 sm:p-8 shadow-2xl text-slate-100">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedIndustry(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 pr-10">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[oklch(0.78_0.12_78/0.2)] text-[oklch(0.78_0.12_78)]">
                {getIndustryIcon(selectedIndustry.iconName)}
              </div>
              <div>
                <p className="eyebrow text-xs">Sector Dossier</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  {selectedIndustry.name}
                </h3>
                <p className="text-sm text-slate-300 mt-1 font-medium">
                  {selectedIndustry.tagline}
                </p>
              </div>
            </div>

            {/* Key Metrics of Sector */}
            <div className="mt-6 grid grid-cols-3 gap-3 p-4 rounded-xl border border-white/10 bg-black/25">
              {selectedIndustry.metrics.map((m, idx) => (
                <div key={idx} className="text-center">
                  <p className="font-display text-xl font-bold text-gradient-gold">
                    {m.value}
                  </p>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Sub-Sectors */}
            <div className="mt-6">
              <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2">
                Sub-Sectors & Specializations
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedIndustry.subsectors.map((sub, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Challenges Solved */}
            <div className="mt-6">
              <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2">
                Key Operational Challenges We Solve
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                {selectedIndustry.challenges.map((c, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[oklch(0.78_0.12_78)] mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions Delivered */}
            <div className="mt-6">
              <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2">
                Proven Deployments & Systems
              </h4>
              <div className="space-y-2.5">
                {selectedIndustry.solutionsDelivered.map((sol, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200">
                    <p className="font-medium text-white">{sol.split(':')[0]}</p>
                    <p className="text-xs text-slate-300 mt-1">
                      {sol.split(':').slice(1).join(':')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Representative Clients & Projects */}
            <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
              <span>Representative Work: <strong className="text-white">{selectedIndustry.sampleClientsOrProjects.join(', ')}</strong></span>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={() => setSelectedIndustry(null)}
                className="w-full sm:w-auto px-5 py-2.5 text-sm text-slate-300 hover:text-white rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const indName = selectedIndustry.name;
                  setSelectedIndustry(null);
                  onRequestQuote(`${indName} Software Engineering`);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] px-6 py-2.5 text-sm font-semibold text-[oklch(0.22_0.03_165)] shadow-gold transition-transform hover:-translate-y-0.5"
              >
                <span>Request Quotation for {selectedIndustry.name}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Shared CTA Banner (as on vision nexus) */}
      <section className="container-x py-16">
        <div className="relative overflow-hidden rounded-3xl border border-[oklch(0.78_0.12_78/0.3)] bg-gradient-to-br from-[oklch(0.34_0.05_165)] to-[oklch(0.26_0.04_165)] p-10 sm:p-14 shadow-elegant">
          <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[oklch(0.78_0.12_78/0.15)] blur-3xl" aria-hidden="true" />
          
          <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="eyebrow mb-3">Let&apos;s build</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Ready to engineer your next platform?
              </h2>
              <p className="mt-4 max-w-xl text-slate-300 text-base leading-relaxed">
                Book a 30-minute discovery call. We&apos;ll listen, sketch the shape of a solution, and share a clear next step.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row md:justify-end gap-3">
              <button
                onClick={() => onRequestQuote()}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] px-6 py-4 font-semibold text-[oklch(0.22_0.03_165)] shadow-gold transition-transform hover:-translate-y-0.5 cursor-pointer text-sm"
              >
                <span>Start a project</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigateSection('contact')}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-5 py-4 font-semibold text-white hover:border-[oklch(0.78_0.12_78)] hover:text-[oklch(0.78_0.12_78)] transition-colors text-sm"
              >
                <span>Contact Nairobi HQ</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
