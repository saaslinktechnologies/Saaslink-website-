import React from 'react';
import { 
  Lock, Phone, Mail, MapPin, 
  ArrowUpRight, ShieldCheck, Clock, ArrowRight, Layers 
} from 'lucide-react';
import { GlobalSettings } from '../../types.ts';

interface FooterProps {
  settings?: GlobalSettings;
  onOpenAdmin: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenQuoteModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
  onNavigateSection,
  onOpenQuoteModal,
}) => {
  return (
    <footer className="bg-[oklch(0.24_0.035_165)] border-t border-white/10 text-slate-300 text-xs">
      
      {/* High-Impact Footer Technical Close CTA */}
      <div className="border-b border-white/10 bg-gradient-to-b from-[oklch(0.28_0.04_165)] to-[oklch(0.24_0.035_165)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/15 bg-[oklch(0.30_0.045_165/0.8)] p-8 sm:p-14 shadow-elegant relative overflow-hidden backdrop-blur-md">
            
            <div className="relative grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-8 items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.85_0.12_80)] mb-3">
                  Direct Engineering Access · Senior Architects
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight font-sans">
                  Have a complex software challenge? <br className="hidden sm:inline" />
                  <span className="text-gradient-gold">Let&apos;s review the architecture together.</span>
                </h2>
                <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                  Whether you are planning a multi-branch ERP deployment, automating manual paperwork and payment reconciliations, or tuning an overloaded relational database — talk directly with our lead solutions architects.
                </p>

                {/* Assurance Checklist */}
                <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[oklch(0.85_0.12_80)]" />
                    <span>100% Client Source Code & IP Handover</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[oklch(0.85_0.12_80)]" />
                    <span>Kenya Data Protection Act 2019 Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[oklch(0.85_0.12_80)]" />
                    <span>Fixed-Price Milestone Deliverables</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-3">
                <button
                  onClick={onOpenQuoteModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] px-6 py-4 text-sm font-bold text-[oklch(0.22_0.03_165)] shadow-gold hover:-translate-y-0.5 hover:brightness-105 transition-all cursor-pointer text-center"
                >
                  <span>Book Architecture Scoping Call</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onNavigateSection('contact')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-6 py-3.5 text-xs font-semibold text-white transition-colors text-center"
                >
                  <span>Direct Technical Contact</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14 text-left">
          
          {/* Col 1: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigateSection('home')}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.85_0.14_85)] via-[oklch(0.78_0.12_78)] to-[oklch(0.68_0.13_65)] p-0.5 shadow-gold">
                <div className="w-full h-full bg-[oklch(0.22_0.03_165)] rounded-[6px] flex items-center justify-center">
                  <Layers className="w-4 h-4 text-[oklch(0.85_0.14_85)]" />
                </div>
              </div>
              <span className="font-bold text-lg text-white font-sans">
                SaaS<span className="text-gradient-gold">Link</span> Technologies Ltd
              </span>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              Engineering the digital core of East African enterprises. We build custom ERP systems, scalable software platforms, resilient cloud architectures, and automated operational workflows.
            </p>

            <div className="pt-2 flex flex-col gap-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[oklch(0.85_0.12_80)] shrink-0" />
                <span>Delta Corner Tower, Westlands, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[oklch(0.85_0.12_80)] shrink-0" />
                <span>Mon – Fri, 8:00am – 6:00pm EAT</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[oklch(0.85_0.12_80)] shrink-0" />
                <span>+254 700 000 000 / +254 720 000 000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[oklch(0.85_0.12_80)] shrink-0" />
                <span>contact@saaslink.tech / solutions@saaslink.co.ke</span>
              </div>
            </div>
          </div>

          {/* Col 2: Sector Platforms */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.85_0.12_80)]">
              Sector Platforms
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={() => onNavigateSection('solutions')} className="hover:text-white transition-colors">
                  MASUMA ERP (Commercial)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('solutions')} className="hover:text-white transition-colors">
                  RaphaMIS Hospital Core
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('solutions')} className="hover:text-white transition-colors">
                  Aura Utility Management
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('solutions')} className="hover:text-white transition-colors">
                  PropCloud360 Property
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('solutions')} className="hover:text-white transition-colors">
                  EMIS Education System
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('solutions')} className="hover:text-white transition-colors">
                  Ecclesiah Church System
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('solutions')} className="hover:text-white transition-colors">
                  Haki Hali Civic Transparency
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Engineering Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.85_0.12_80)]">
              Services
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={() => onNavigateSection('services')} className="hover:text-white transition-colors">
                  Custom Software Development
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('services')} className="hover:text-white transition-colors">
                  Process Automation & Paperless
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('services')} className="hover:text-white transition-colors">
                  Institutional Web Portals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('services')} className="hover:text-white transition-colors">
                  Cloud Architecture & DevOps
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('services')} className="hover:text-white transition-colors">
                  Systems Performance Tuning
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.85_0.12_80)]">
              Company & Standards
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={() => onNavigateSection('about')} className="hover:text-white transition-colors">
                  About SaaSLink
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('portfolio')} className="hover:text-white transition-colors">
                  Case Studies & ROI
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('insights')} className="hover:text-white transition-colors">
                  Engineering Insights
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('careers')} className="hover:text-white transition-colors">
                  Careers & Squads
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('faqs')} className="hover:text-white transition-colors">
                  Technical FAQs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy & DPA 2019
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Admin Portal Access */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <div>
            © {new Date().getFullYear()} SaaSLink Technologies Ltd. All rights reserved. Registered in Kenya.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Client & Staff Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
