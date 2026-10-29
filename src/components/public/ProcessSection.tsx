import React from 'react';
import { 
  Search, Cpu, Layout, GitPullRequest, 
  ShieldCheck, Rocket, CheckCircle2 
} from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Discovery & Enterprise Architecture',
      description: 'We audit your legacy workflows, data flows, and commercial targets to produce an unambiguous technical architecture blueprint before any code is drafted.',
      deliverable: 'System Specification & Cost Envelope',
    },
    {
      num: '02',
      icon: Cpu,
      title: 'Database & Relational Modeling',
      description: 'We design normalized relational database schemas (MySQL 8.0+ InnoDB), indexing strategies, and API contracts ensuring data integrity from day zero.',
      deliverable: 'DDL Schemas & API Documentation',
    },
    {
      num: '03',
      icon: Layout,
      title: 'Design Systems & High-Fidelity UX',
      description: 'Interactive wireframes and responsive layouts built for ergonomics, rapid task completion, and intuitive field/desktop adoption.',
      deliverable: 'Interactive Prototypes & Style Guides',
    },
    {
      num: '04',
      icon: GitPullRequest,
      title: 'Sprint-Based Agile Engineering',
      description: 'Clean, type-safe TypeScript engineering with automated unit tests, continuous integration, and transparent weekly client milestone demos.',
      deliverable: 'Milestone Deployments & Staging Sandbox',
    },
    {
      num: '05',
      icon: ShieldCheck,
      title: 'Rigorous QA, Audit & UAT',
      description: 'Penetration testing, role-permission audits, load testing, and formal user acceptance sign-off under realistic enterprise volumes.',
      deliverable: 'Security & Compliance Sign-Off Certificate',
    },
    {
      num: '06',
      icon: Rocket,
      title: 'Cloud Handover & SLA Support',
      description: 'Production cutover, automated backup pipeline activation, full source code IP assignment, and 24/7 technical monitoring.',
      deliverable: 'Full IP Assignment & Enterprise SLA',
    },
  ];

  return (
    <section id="process" className="py-20 sm:py-24 bg-[oklch(0.28_0.038_165)] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.85_0.12_80)]">
            Engineering Discipline
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight font-sans">
            Predictable Delivery from <span className="text-gradient-gold">Blueprint to Cloud Cutover</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Our systematic 6-stage delivery methodology eliminates budget surprises, scope creep, and operational downtime.
          </p>
        </div>

        {/* Process Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[oklch(0.32_0.045_165/0.8)] border border-white/10 hover:border-[oklch(0.78_0.12_78/0.4)] transition-all duration-300 text-left flex flex-col justify-between shadow-elegant backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center text-[oklch(0.85_0.12_80)]">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-2xl font-bold text-slate-500">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 font-sans">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-[oklch(0.85_0.12_80)]">
                  <CheckCircle2 className="w-4 h-4 text-[oklch(0.85_0.12_80)] shrink-0" />
                  <span className="font-medium">Deliverable: {step.deliverable}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
