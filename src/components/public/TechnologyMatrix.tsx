import React, { useState } from 'react';
import { 
  Database, Server, Layout, ShieldCheck, 
  Cloud, Smartphone, Check, Cpu, Terminal, ArrowUpRight 
} from 'lucide-react';

export const TechnologyMatrix: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'languages' | 'cloud' | 'databases' | 'ai'>('all');

  const stack = [
    {
      name: 'Go (Golang)',
      category: 'languages',
      role: 'High-Concurrency Microservices',
      description: 'Ultra-low CPU overhead, native goroutines for concurrent payment pipelines, and instant compiled execution.',
      status: 'Adopt / Core',
      highlight: true,
    },
    {
      name: 'Python (FastAPI / PyTorch)',
      category: 'ai',
      role: 'Applied AI & Data Engineering',
      description: 'High-throughput async APIs, RAG embedding pipelines, predictive scoring, and automated document analysis.',
      status: 'Adopt / Core',
      highlight: true,
    },
    {
      name: 'TypeScript & Node.js',
      category: 'languages',
      role: 'Strict Type-Safe API Core',
      description: 'Unified type contracts across frontend and backend boundaries with rock-solid validation via Zod and NestJS.',
      status: 'Adopt / Core',
      highlight: false,
    },
    {
      name: 'React 19 & Next.js',
      category: 'languages',
      role: 'Modern Client Interface Engine',
      description: 'Server components, instantaneous edge rendering, accessible UI tokens, and zero-jank responsiveness.',
      status: 'Adopt / Core',
      highlight: false,
    },
    {
      name: 'Kubernetes (K8s)',
      category: 'cloud',
      role: 'Container Orchestration & GitOps',
      description: 'Self-healing pod replicas, automated horizontal scaling, and declarative continuous delivery using ArgoCD.',
      status: 'Adopt / Core',
      highlight: true,
    },
    {
      name: 'Amazon Web Services (AWS)',
      category: 'cloud',
      role: 'Enterprise Cloud Infrastructure',
      description: 'Multi-AZ VPCs, RDS Aurora, S3 immutable storage, AWS KMS cryptographic security, and CloudFront edge caching.',
      status: 'Adopt / Core',
      highlight: true,
    },
    {
      name: 'MySQL 8.0+ / MariaDB',
      category: 'databases',
      role: 'ACID Relational Transaction Core',
      description: 'Deterministic double-entry ledgers, foreign key constraints, JSON documents, and multi-region replication.',
      status: 'Adopt / Core',
      highlight: true,
    },
    {
      name: 'PostgreSQL & pgvector',
      category: 'databases',
      role: 'Relational & Vector Search Engine',
      description: 'Hybrid relational data modeling combined with cosine similarity embeddings for private enterprise RAG pipelines.',
      status: 'Adopt / Core',
      highlight: false,
    },
    {
      name: 'Redis Cache & Pub/Sub',
      category: 'databases',
      role: 'Distributed In-Memory Acceleration',
      description: 'Sub-millisecond session state caching, token bucket API rate limiting, and reliable BullMQ task queues.',
      status: 'Adopt / Core',
      highlight: false,
    },
    {
      name: 'Docker & OCI Containers',
      category: 'cloud',
      role: 'Deterministic Containerization',
      description: '100% reproducible environments from local developer workstations to staging and production clusters.',
      status: 'Adopt / Core',
      highlight: false,
    },
    {
      name: 'M-Pesa Daraja & KRA eTIMS',
      category: 'languages',
      role: 'Fintech & Fiscal Compliance APIs',
      description: 'Instant STK push, automated B2B/B2C callbacks, and cryptographic QR code generation for tax verification.',
      status: 'Adopt / Core',
      highlight: true,
    },
    {
      name: 'Terraform & OpenTofu',
      category: 'cloud',
      role: 'Infrastructure as Code (IaC)',
      description: 'Auditable declarative infrastructure state with zero manual console configuration and drift detection.',
      status: 'Adopt / Core',
      highlight: false,
    },
  ];

  const filtered = activeTab === 'all' 
    ? stack 
    : stack.filter(s => s.category === activeTab);

  return (
    <section id="stack" className="py-24 bg-[oklch(0.28_0.038_165)] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with exact requested blurb */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.85_0.12_80)]">The Technology Matrix</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight font-sans">
            A Battle-Tested Stack. <span className="text-gradient-gold">Chosen for Longevity, Not Hype.</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            We don&apos;t gamble your company&apos;s future on unstable JavaScript frameworks or ephemeral tooling fads. Every layer of our technology matrix is selected for strict type safety, memory safety, concurrency performance, and widespread enterprise support. When we choose a tool, we commit to its long-term maintainability so your internal team can operate it without friction for the next decade.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap items-center sm:justify-center gap-2 mb-10 sm:mb-12 pb-2 sm:pb-0 px-2 sm:px-0 -mx-4 sm:mx-0 px-4 sm:px-0">
          {[
            { id: 'all', label: 'All Technologies' },
            { id: 'languages', label: 'Languages & Frameworks' },
            { id: 'cloud', label: 'Cloud & DevOps (AWS / K8s)' },
            { id: 'databases', label: 'Databases & Ledgers' },
            { id: 'ai', label: 'Applied AI & Vectors' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[44px] flex items-center justify-center whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] shadow-gold font-bold'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Visual Grid of Technologies */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between backdrop-blur-md ${
                item.highlight 
                  ? 'bg-[oklch(0.34_0.045_165/0.8)] border-[oklch(0.78_0.12_78/0.4)] shadow-elegant' 
                  : 'bg-[oklch(0.31_0.04_165/0.6)] border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[oklch(0.85_0.12_80)] font-semibold">
                    {item.status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Enterprise
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 font-sans">
                  {item.name}
                </h3>
                <p className="text-xs font-semibold text-[oklch(0.85_0.12_80)] mb-3">
                  {item.role}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Production Verified</span>
                <Check className="h-4 w-4 text-[oklch(0.85_0.12_80)]" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
