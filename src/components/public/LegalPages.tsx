import React from 'react';
import { ChevronRight, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

interface LegalPageProps {
  pageType: 'privacy' | 'terms' | 'cookies';
  onNavigateSection: (page: string) => void;
  onRequestQuote: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({
  pageType,
  onNavigateSection,
  onRequestQuote,
}) => {
  const titles = {
    privacy: {
      eyebrow: 'Legal & Compliance',
      title: 'Privacy Policy',
      subtitle: 'How SaaSLink Technologies collects, uses, and safeguards personal and client data under the Kenya Data Protection Act 2019.',
      lastUpdated: 'May 2026',
    },
    terms: {
      eyebrow: 'Legal & Agreement',
      title: 'Terms of Service',
      subtitle: 'The terms governing engagement, intellectual property transfer, and website usage with SaaSLink Technologies Limited.',
      lastUpdated: 'May 2026',
    },
    cookies: {
      eyebrow: 'Privacy Controls',
      title: 'Cookie Policy',
      subtitle: 'How SaaSLink Technologies uses essential cookies, telemetry, and preference storage on this website.',
      lastUpdated: 'May 2026',
    },
  };

  const current = titles[pageType];

  return (
    <div className="min-h-screen bg-[oklch(0.32_0.04_165)] text-slate-100">
      
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-[oklch(0.36_0.045_165)] to-[oklch(0.32_0.04_165)] pt-8 pb-16">
        <div className="container-x">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <button 
              onClick={() => onNavigateSection('home')} 
              className="hover:text-gold transition-colors"
            >
              Home
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-gold font-semibold">{current.title}</span>
          </nav>

          <div className="max-w-3xl">
            <p className="eyebrow mb-3">{current.eyebrow}</p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.05]">
              {current.title}
            </h1>
            <p className="mt-4 text-lg text-slate-300 leading-relaxed font-normal">
              {current.subtitle}
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Effective Date: {current.lastUpdated} · SaaSLink Technologies Limited (Nairobi, Kenya)
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="container-x py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-[oklch(0.36_0.045_165/0.6)] p-8 sm:p-12 backdrop-blur-sm text-slate-200 space-y-8 text-sm leading-relaxed">
          
          {pageType === 'privacy' && (
            <>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">1. Regulatory Framework</h3>
                <p>
                  SaaSLink Technologies Limited (&quot;SaaSLink&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is registered and headquartered in Nairobi, Kenya. We operate strictly in compliance with the <strong>Kenya Data Protection Act, 2019 (KDPA)</strong> and international security standards including ISO/IEC 27001 principles.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">2. Information We Collect</h3>
                <p>
                  We collect information necessary to deliver enterprise software engineering, advisory, and billing services:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-300">
                  <li><strong>Enquiry & Quotation Data:</strong> Name, work email, phone number, corporate entity, project budget, and technical briefs.</li>
                  <li><strong>System & Telemetry Data:</strong> IP address, device fingerprints, browser headers, and session analytics to prevent unauthorized penetration attempts.</li>
                  <li><strong>Client Operational Data:</strong> Database schema metadata, sandbox credentials, and encrypted test fixtures during project execution under signed non-disclosure agreements (NDAs).</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">3. Data Security & Storage</h3>
                <p>
                  All data in transit is encrypted using modern TLS 1.3 protocols. All production databases and backups utilize AES-256 encryption at rest. For Kenyan financial and healthcare clients, we provide local data residency options within Nairobi-based certified tier-3 data centers.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">4. Client Data Ownership</h3>
                <p>
                  We adhere to zero vendor lock-in. All client transactional data, business records, and customer records remain 100% the property of the client. SaaSLink does not sell, lease, or monetize client data under any circumstances.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">5. Data Protection Officer Contact</h3>
                <p>
                  For data subject access requests (DSAR) or compliance queries:
                  <br />
                  <span className="text-[oklch(0.78_0.12_78)] font-medium">Data Protection Office: privacy@saaslink.tech / legal@saaslink.tech</span>
                  <br />
                  Delta Corner Tower, Westlands, Nairobi, Kenya.
                </p>
              </div>
            </>
          )}

          {pageType === 'terms' && (
            <>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">1. Scope of Engagement</h3>
                <p>
                  These terms govern website usage, project proposals, and professional engineering services delivered by SaaSLink Technologies Limited. Individual projects are additionally governed by executed Master Services Agreements (MSAs) and Statements of Work (SOWs).
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">2. 100% Intellectual Property (IP) Transfer</h3>
                <p>
                  Unlike closed SaaS vendors, SaaSLink operates on an explicit IP transfer model. Upon full settlement of project milestone invoices, all bespoke source code, database architectures, Figma prototypes, and technical documentation are assigned 100% to the client.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">3. Warranty & Defect Liability</h3>
                <p>
                  Every production deployment executed by SaaSLink carries a guaranteed 90-day defect remediation warranty against functional deviations from agreed technical specifications, with no additional billing.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">4. Payment & Milestone Schedules</h3>
                <p>
                  Standard engagements follow structured milestone payments (e.g. 40% Architecture & Mobilization, 30% User Acceptance Staging, 30% Final Production Cutover). Invoices are payable via direct RTGS, EFT, Swift, or verified M-Pesa Business Paybill.
                </p>
              </div>
            </>
          )}

          {pageType === 'cookies' && (
            <>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">1. How We Use Cookies</h3>
                <p>
                  We utilize cookies and local storage tokens to deliver core website functionality:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-300">
                  <li><strong>Essential Authentication Cookies:</strong> Maintaining active administrative portal sessions and RBAC authorization tokens.</li>
                  <li><strong>Preference Cookies:</strong> Remembering quotation planner selections, theme states, and navigation history.</li>
                  <li><strong>Telemetry & Performance:</strong> Aggregated, anonymized latency benchmarks to ensure snappy sub-200ms page delivery across East African mobile networks.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">2. Managing Cookie Preferences</h3>
                <p>
                  You can modify your browser settings to decline non-essential cookies. Essential session cookies are required for administrative login and interactive quotation generation.
                </p>
              </div>
            </>
          )}

        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-20">
        <div className="text-center">
          <button
            onClick={() => onNavigateSection('contact')}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] px-6 py-3 text-sm font-semibold text-[oklch(0.22_0.03_165)] shadow-gold"
          >
            <span>Have questions? Contact our team</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
