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
    <section id="process" className="py-24 bg-slate-900/30 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400">
            <span>Engineering Discipline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Predictable delivery from blueprint to cloud deployment
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
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
                className="p-7 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-2xl font-bold text-slate-700">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-bold text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-cyan-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
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
