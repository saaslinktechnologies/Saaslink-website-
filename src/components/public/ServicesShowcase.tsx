import React, { useState } from 'react';
import { 
  Code2, LayoutDashboard, CloudCog, Cpu, LineChart, 
  ArrowRight, Check, Sparkles, HelpCircle, Workflow, Zap 
} from 'lucide-react';
import { Service } from '../../types.ts';

interface ServicesShowcaseProps {
  services?: Service[];
  onSelectService: (service: Service) => void;
  onRequestQuoteForService?: (serviceTitle: string) => void;
  onRequestQuote?: (serviceTitle: string) => void;
}

const DEFAULT_KENYA_SERVICES: Service[] = [
  {
    id: 'srv_01',
    title: 'Custom Software Development for Multiple Sectors',
    slug: 'custom-software-development',
    category: 'Software Engineering',
    shortDescription: 'Purpose-built software platforms, bespoke multi-branch ERP modules, and custom relational backends designed for Kenyan corporates, non-profits, healthcare, and faith institutions.',
    fullDescription: 'We design and construct production-grade enterprise software systems from the ground up. By combining clean domain-driven architecture, robust relational schema modeling (MySQL/PostgreSQL), and resilient API contracts, we replace brittle legacy spreadsheets with software that perfectly matches your organization\'s real-world operational rules.',
    iconName: 'Code2',
    features: [
      'Sector-Specific Architectural Design (Corporates, NGOs, Churches, Healthcare)',
      'Multi-Branch ERP & Operational Workflow Construction',
      'Role-Based Granular Access Control (RBAC) & Immutable Audit Trails',
      'Automated CI/CD Testing & High-Throughput REST APIs',
    ],
    benefits: [
      'Zero recurring per-seat vendor licensing constraints',
      '100% intellectual property and full source code ownership',
      'Unrivaled alignment with your proprietary operational logic',
    ],
    displayOrder: 1,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'srv_02',
    title: 'Process Automation & Paperless Operations',
    slug: 'process-automation-digital',
    category: 'Process Automation',
    shortDescription: 'Convert manual paper vouchers, physical receipt books, and Excel chaos into automated digital workflows with real-time M-Pesa Paybill matching.',
    fullDescription: 'Kenyan organizations lose hundreds of billable hours and millions in revenue to manual bookkeeping, lost paper forms, and delayed reconciliations. We build automated middleware, webhook listeners, digital approval workflows, and instant M-Pesa ledger synchronizers that eliminate human entry error.',
    iconName: 'Cpu',
    features: [
      'M-Pesa Daraja STK Push & Automated Paybill / C2B Ledger Matching',
      'Digital Requisition, Multi-Tier Voucher & Purchase Order Approvals',
      'Paperless Tablet Field Inspection & Offline Survey Synchronization',
      'Automated SMS Receipts, Invoices & Balance Alerts',
    ],
    benefits: [
      'Reclaim up to 35 hours per week of manual clerical reconciliation',
      'Zero human data transfer errors between field branches and headquarters',
      'Instant cashflow visibility across all collection points',
    ],
    displayOrder: 2,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'srv_03',
    title: 'Corporate, NGO & Institutional Modern Websites',
    slug: 'modern-websites-portals',
    category: 'Web Platforms',
    shortDescription: 'High-converting, responsive websites, client extranets, member portals, and e-commerce platforms engineered for Kenyan audiences.',
    fullDescription: 'From high-impact corporate brand showcases to citizen engagement portals and church congregation intranets, we engineer responsive web platforms with ultra-fast page speeds, native mobile money checkout, and clean content management. Every interface is crafted to build credibility and drive engagement.',
    iconName: 'LayoutDashboard',
    features: [
      'Mobile-first responsive UX optimized for East African bandwidth',
      'Integrated M-Pesa Express & Card Payment Checkout Gates',
      'Secure Member, Donor, and Client Extranet Portals',
      'Comprehensive SEO, Social Share Cards & Schema Markup',
    ],
    benefits: [
      'Turn web visitors into qualified client and donor inquiries',
      'Deliver sub-second load times on both mobile smartphones and desktops',
      'Bank-grade authentication and session protection',
    ],
    displayOrder: 3,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'srv_04',
    title: 'Cloud Architecting & Deployment',
    slug: 'cloud-infrastructure-devops',
    category: 'Cloud & Infrastructure',
    shortDescription: 'Multi-cloud hosting (AWS, Google Cloud, Docker VPS) with zero-downtime cutovers, automated multi-region backups, and cybersecurity hardening.',
    fullDescription: 'We architect and operate bulletproof cloud hosting environments that withstand heavy traffic spikes and maintain mission-critical uptime. We configure Docker containerization, automated infrastructure-as-code, daily encrypted snapshots, and disaster recovery pipelines.',
    iconName: 'CloudCog',
    features: [
      'Automated container deployments with Docker and Kubernetes',
      'Database replication, point-in-time recovery & encryption-at-rest',
      'Local Kenyan VPS and Global Cloud (AWS/GCP) Hybrid Hosting',
      '24/7 proactive metrics, error telemetry & performance alerts',
    ],
    benefits: [
      '99.98% uptime SLA guarantee for mission-critical operations',
      'Predictable, optimized cloud infrastructure hosting expenditure',
      'Rapid disaster recovery with automated daily offsite snapshots',
    ],
    displayOrder: 4,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'srv_05',
    title: 'Systems Optimization & Performance Engineering',
    slug: 'systems-optimization-performance',
    category: 'Systems Optimization',
    shortDescription: 'Stop server crashes and sluggish load times. We audit slow relational databases, tune query indexes, refactor bottlenecked code, and eliminate lag.',
    fullDescription: 'As systems scale, unoptimized SQL queries and bloated monolithic code cause agonizing delays and server freezes during peak usage hours. SaaSLink conducts deep architectural audits, tunes MySQL/PostgreSQL schema indexes, eliminates N+1 query bottlenecks, and hardens application security against vulnerabilities.',
    iconName: 'LineChart',
    features: [
      'Database Schema Indexing, Normalization & SQL Query Optimization',
      'Server Latency Elimination & Peak Traffic Stress Testing',
      'Legacy Code Refactoring & Microservice Decoupling',
      'Security Posture Audits & Kenya DPA 2019 Compliance',
    ],
    benefits: [
      'Reduce query execution latency by up to 80% without expensive new hardware',
      'Prevent costly server outages during end-month billing and reporting rushes',
      'Prolong the lifespan of existing core software assets',
    ],
    displayOrder: 5,
    isFeatured: true,
    isPublished: true,
  },
];

export const ServicesShowcase: React.FC<ServicesShowcaseProps> = ({
  services = [],
  onSelectService,
  onRequestQuoteForService,
  onRequestQuote,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const rawServices = (services && services.length > 0) ? services : DEFAULT_KENYA_SERVICES;
  
  // Ensure the 5 core scopes exist even if API only returned partial
  const safeServices = [...rawServices];
  DEFAULT_KENYA_SERVICES.forEach(defServ => {
    if (!safeServices.some(s => s.slug === defServ.slug || s.title.toLowerCase() === defServ.title.toLowerCase())) {
      safeServices.push(defServ);
    }
  });

  const handleRequestQuote = onRequestQuote || onRequestQuoteForService || (() => {});

  const categories = ['All', ...Array.from(new Set(safeServices.map(s => s.category).filter(Boolean)))];

  const filteredServices = selectedCategory === 'All' 
    ? safeServices 
    : safeServices.filter(s => s.category === selectedCategory);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutDashboard': return LayoutDashboard;
      case 'CloudCog': return CloudCog;
      case 'Cpu': return Cpu;
      case 'LineChart': return LineChart;
      default: return Code2;
    }
  };

  return (
    <section id="services" className="py-16 sm:py-24 bg-[oklch(0.26_0.038_165)] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6 text-left">
          <div className="max-w-2xl space-y-2.5 sm:space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.85_0.12_80)]">
              Core Engineering Capabilities
            </p>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight font-sans">
              Enterprise Software Built for <span className="text-gradient-gold">Real Impact</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              We design, construct, automate, and optimize digital systems for corporates, non-profits, and faith-based entities across Kenya.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap gap-2 pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] shadow-gold font-bold'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid (1 col mobile, 2 cols tablet, 3 cols desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const IconComponent = getServiceIcon(service.iconName);
            return (
              <div
                key={service.id || service.slug}
                className="group p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[oklch(0.32_0.045_165/0.7)] border border-white/10 hover:border-[oklch(0.78_0.12_78/0.4)] transition-all duration-300 flex flex-col justify-between text-left relative overflow-hidden shadow-elegant backdrop-blur-md hover:-translate-y-1"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center text-[oklch(0.85_0.12_80)] mb-5">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <span className="text-xs font-semibold uppercase text-[oklch(0.85_0.12_80)] tracking-wider">
                    {service.category}
                  </span>

                  <h3 className="text-base sm:text-lg font-bold text-white mt-1 mb-2.5 group-hover:text-[oklch(0.85_0.12_80)] transition-colors font-sans">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 font-normal">
                    {service.shortDescription}
                  </p>

                  {/* Features Checklist */}
                  <div className="space-y-2 mb-5">
                    {(service.features || []).slice(0, 3).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-200">
                        <Check className="w-3.5 h-3.5 text-[oklch(0.85_0.12_80)] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectService(service)}
                    className="text-xs font-semibold text-slate-300 hover:text-white inline-flex items-center justify-center gap-1.5 cursor-pointer py-1"
                  >
                    <span>Full Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleRequestQuote(service.title)}
                    className="px-3.5 py-2 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] shadow-gold font-bold text-xs transition-all hover:brightness-105 cursor-pointer text-center"
                  >
                    Request Scoping
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
