import React, { useState } from 'react';
import { 
  Briefcase, ArrowUpRight, TrendingUp, CheckCircle2, 
  ExternalLink, Layers, ArrowRight, ShieldCheck, Play 
} from 'lucide-react';
import { PortfolioProject } from '../../types.ts';

interface PortfolioShowcaseProps {
  portfolio?: PortfolioProject[];
  onSelectProject: (project: PortfolioProject) => void;
}

export const PortfolioShowcase: React.FC<PortfolioShowcaseProps> = ({
  portfolio = [],
  onSelectProject,
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const safePortfolio = portfolio || [];

  const industries = ['All', ...Array.from(new Set(safePortfolio.map(p => p.industry).filter(Boolean)))];

  const filtered = selectedIndustry === 'All'
    ? safePortfolio
    : safePortfolio.filter(p => p.industry === selectedIndustry);

  return (
    <section id="portfolio" className="py-24 bg-[oklch(0.28_0.038_165)] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.85_0.12_80)]">
              Proven Engineering Outcomes
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight font-sans">
              Architectural Blueprints <span className="text-gradient-gold">Put to the Test</span>
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Real-world metrics from platforms processing millions in monthly volume, scaling to hundreds of thousands of concurrent users, and operating in audited industries.
            </p>
          </div>

          {/* Industry Filter */}
          <div className="flex flex-wrap gap-2">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedIndustry === ind
                    ? 'bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] shadow-gold font-bold'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Case Study Spotlight Banner: Baraka SACCO */}
        <div className="mb-14 rounded-3xl border border-white/15 bg-[oklch(0.32_0.045_165/0.8)] p-8 sm:p-12 shadow-elegant relative overflow-hidden backdrop-blur-md">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[oklch(0.78_0.12_78/0.15)] blur-3xl" />
          
          <div className="relative grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[oklch(0.85_0.12_80)] font-semibold block mb-2">
                Featured Engineering Deployment · Financial Core
              </span>

              <h3 className="text-2xl sm:text-3xl font-bold text-white font-sans">
                Baraka SACCO & Financial Core: High-Throughput Modernization
              </h3>

              <p className="mt-3 text-sm text-slate-300 leading-relaxed font-normal">
                <strong>The Challenge:</strong> A financial institution serving over 4 million members suffered from legacy on-premise servers experiencing timeout failures, ledger discrepancies, and multi-day end-month reconciliation lag.
              </p>

              <p className="mt-2 text-sm text-slate-300 leading-relaxed font-normal">
                <strong>The Engineering Solution:</strong> Architected an event-driven microservices platform on Kubernetes with clustered PostgreSQL databases. Integrated a real-time M-Pesa Daraja and interbank payment engine with automated double-entry bookkeeping and biometric KYC verification.
              </p>

              {/* Spotlight Metrics */}
              <div className="mt-6 grid grid-cols-3 gap-3 p-4 rounded-2xl bg-black/30 border border-white/10">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-gradient-gold font-sans">99.99%</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Success Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-gradient-gold font-sans">-78%</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Discrepancies</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-gradient-gold font-sans">0 sec</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Downtime</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start lg:items-end justify-center gap-3">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 w-full space-y-2">
                <p className="text-[oklch(0.85_0.12_80)] font-semibold">Verified Stack In Production:</p>
                <p className="text-slate-300">• Kubernetes Cluster (Multi-AZ)</p>
                <p className="text-slate-300">• Clustered PostgreSQL + Redis State</p>
                <p className="text-slate-300">• M-Pesa Daraja STK + B2B Webhooks</p>
                <p className="text-slate-300">• AES-256 Kenya DPA 2019 Encryption</p>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Projects Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item: any) => (
            <div
              key={item.id}
              onClick={() => onSelectProject(item)}
              className="group relative flex flex-col justify-between p-7 rounded-3xl bg-[oklch(0.32_0.045_165/0.7)] border border-white/10 hover:border-[oklch(0.78_0.12_78/0.4)] transition-all duration-300 hover:-translate-y-1 shadow-elegant backdrop-blur-md cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-xs font-semibold text-[oklch(0.85_0.12_80)]">
                    {item.industry}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {item.videoUrl && (
                      <span className="px-2 py-0.5 rounded-full bg-black/60 border border-[oklch(0.78_0.12_78/0.4)] text-[10px] font-mono text-[oklch(0.85_0.12_80)] flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-[oklch(0.85_0.12_80)]" />
                        <span>Video</span>
                      </span>
                    )}
                    <span className="text-slate-400 text-xs">
                      {item.client || item.clientName}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[oklch(0.85_0.12_80)] transition-colors font-sans">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs text-slate-300 line-clamp-3 leading-relaxed font-normal">
                  {item.shortSummary || item.description}
                </p>

                {/* Tech List */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(item.technologies || []).slice(0, 3).map((tech: string, tIdx: number) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 border border-white/10 text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[oklch(0.85_0.12_80)]">
                <span className="group-hover:underline">Read Architecture Case Study</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
