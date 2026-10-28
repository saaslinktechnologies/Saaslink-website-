import React, { useState } from 'react';
import { 
  Layers, Users, GraduationCap, Activity, 
  Building2, ShoppingBag, Cpu, BarChart3, 
  ChevronRight, ArrowRight, CheckCircle2, X, Sparkles 
} from 'lucide-react';
import { GlobalSettings } from '../../types.ts';
import { SOLUTIONS_DATA, CORE_METRICS } from '../../data/nexusData.ts';

interface SolutionsPageProps {
  settings?: GlobalSettings;
  onRequestQuote: (solutionName?: string) => void;
  onNavigateSection: (page: string) => void;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({
  settings,
  onRequestQuote,
  onNavigateSection,
}) => {
  const [selectedSolution, setSelectedSolution] = useState<typeof SOLUTIONS_DATA[0] | null>(null);

  const getSolutionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers':
        return <Layers className="h-6 w-6" />;
      case 'Users':
        return <Users className="h-6 w-6" />;
      case 'GraduationCap':
        return <GraduationCap className="h-6 w-6" />;
      case 'Activity':
        return <Activity className="h-6 w-6" />;
      case 'Building2':
        return <Building2 className="h-6 w-6" />;
      case 'ShoppingBag':
        return <ShoppingBag className="h-6 w-6" />;
      case 'Cpu':
        return <Cpu className="h-6 w-6" />;
      case 'BarChart3':
      default:
        return <BarChart3 className="h-6 w-6" />;
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
            <span className="text-gold font-semibold">Solutions</span>
          </nav>

          {/* Eyebrow and Page Title */}
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">Solutions</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
              Platforms built to <span className="text-gradient-gold">your workflow</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
              We combine reusable engineering foundations with deep customisation to deliver platforms that fit your business — not the other way around.
            </p>
          </div>

          {/* Stats Bar */}
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

      {/* Solutions Grid */}
      <section className="container-x py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Enterprise Ready-to-Tailor Platforms
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Battle-tested architectural blocks configured to your operations with custom workflows and integrations.
            </p>
          </div>
          <button
            onClick={() => onRequestQuote('Custom Platform')}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] px-4 py-2.5 text-xs font-semibold text-[oklch(0.22_0.03_165)] shadow-gold transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Request Demo or Proposal</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {SOLUTIONS_DATA.map((sol) => (
            <article
              key={sol.slug}
              onClick={() => setSelectedSolution(sol)}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[oklch(0.36_0.045_165/0.6)] p-8 transition-all hover:-translate-y-1 hover:border-[oklch(0.78_0.12_78/0.5)] hover:shadow-elegant cursor-pointer backdrop-blur-sm"
            >
              <div className="flex items-start gap-5">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[oklch(0.78_0.12_78/0.15)] text-[oklch(0.78_0.12_78)] group-hover:bg-[oklch(0.78_0.12_78)] group-hover:text-[oklch(0.22_0.03_165)] transition-colors">
                  {getSolutionIcon(sol.iconName)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-widest text-[oklch(0.78_0.12_78)] font-semibold">
                    {sol.tagline}
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-white group-hover:text-[oklch(0.85_0.12_80)] transition-colors">
                    {sol.name}
                  </h3>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    {sol.desc}
                  </p>
                  
                  {/* Modules Preview */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {sol.modules.slice(0, 3).map((mod, mIdx) => (
                      <span 
                        key={mIdx}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10"
                      >
                        {mod}
                      </span>
                    ))}
                    {sol.modules.length > 3 && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                        +{sol.modules.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10 text-xs font-semibold text-[oklch(0.78_0.12_78)]">
                    <span className="group-hover:underline">View Architectural Modules</span>
                    <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Solution Detail Modal */}
      {selectedSolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-up">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[oklch(0.78_0.12_78/0.4)] bg-[oklch(0.34_0.045_165)] p-6 sm:p-8 shadow-2xl text-slate-100">
            <button
              onClick={() => setSelectedSolution(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4 pr-10">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[oklch(0.78_0.12_78/0.2)] text-[oklch(0.78_0.12_78)]">
                {getSolutionIcon(selectedSolution.iconName)}
              </div>
              <div>
                <p className="eyebrow text-xs">{selectedSolution.tagline}</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  {selectedSolution.name}
                </h3>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  {selectedSolution.desc}
                </p>
              </div>
            </div>

            {/* Core Modules Included */}
            <div className="mt-6">
              <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2">
                Included Enterprise Modules
              </h4>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {selectedSolution.modules.map((m, mIdx) => (
                  <div key={mIdx} className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[oklch(0.78_0.12_78)]" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mt-6">
              <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2">
                Engineered With
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedSolution.tech.map((t, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-xs px-3 py-1 rounded-lg bg-[oklch(0.78_0.12_78/0.1)] border border-[oklch(0.78_0.12_78/0.3)] text-[oklch(0.85_0.12_80)] font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={() => setSelectedSolution(null)}
                className="w-full sm:w-auto px-5 py-2.5 text-sm text-slate-300 hover:text-white rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const solName = selectedSolution.name;
                  setSelectedSolution(null);
                  onRequestQuote(`Tailored ${solName}`);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] px-6 py-2.5 text-sm font-semibold text-[oklch(0.22_0.03_165)] shadow-gold transition-transform hover:-translate-y-0.5"
              >
                <span>Request Quotation for {selectedSolution.name}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Shared CTA Banner */}
      <section className="container-x py-16">
        <div className="relative overflow-hidden rounded-3xl border border-[oklch(0.78_0.12_78/0.3)] bg-gradient-to-br from-[oklch(0.34_0.05_165)] to-[oklch(0.26_0.04_165)] p-10 sm:p-14 shadow-elegant">
          <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[oklch(0.78_0.12_78/0.15)] blur-3xl" aria-hidden="true" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="eyebrow mb-3">Let&apos;s build</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Need a platform designed around your exact business logic?
              </h2>
              <p className="mt-4 max-w-xl text-slate-300 text-base leading-relaxed">
                Schedule a system scoping session. We will evaluate your current software stack and deliver an architectural roadmap within 48 hours.
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
                onClick={() => onNavigateSection('industries')}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-5 py-4 font-semibold text-white hover:border-[oklch(0.78_0.12_78)] hover:text-[oklch(0.78_0.12_78)] transition-colors text-sm"
              >
                <span>Explore Industries</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
