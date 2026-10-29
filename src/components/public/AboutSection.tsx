import React from 'react';
import { 
  Building, ShieldCheck, Award, Users, 
  MapPin, Globe, CheckCircle2 
} from 'lucide-react';
import { GlobalSettings, TeamMember } from '../../types.ts';

interface AboutSectionProps {
  settings?: GlobalSettings;
  team?: TeamMember[];
  onOpenQuoteModal?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  settings,
  team = [],
  onOpenQuoteModal,
}) => {
  const address = settings?.companyAddress || settings?.address || 'Delta Corner Tower, Westlands, Nairobi, Kenya';
  const taxId = settings?.taxId || 'P051982341Z';
  const safeTeam = team || [];

  return (
    <section id="about" className="py-16 sm:py-24 bg-[oklch(0.26_0.038_165)] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Company Identity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 sm:mb-20">
          
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] text-xs font-semibold text-[oklch(0.85_0.12_80)]">
              <span>Corporate Overview</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight leading-tight font-sans">
              Engineering sustainable autonomy for <span className="text-gradient-gold">African enterprises</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              Founded on the belief that mission-critical businesses deserve bespoke, robust software systems without debilitating foreign license lock-ins, <strong className="text-white">SaaSLink Technologies Ltd</strong> designs, architects, and maintains enterprise-grade applications.
            </p>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              Headquartered in Westlands, Nairobi, Kenya, our senior engineering guild serves regional corporate wholesale distributors, hospitals, utility boards, schools, and civic non-profits across East Africa.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[oklch(0.30_0.04_165/0.8)] border border-white/10 shadow-sm backdrop-blur-md">
                <div className="text-xl sm:text-2xl font-bold text-[oklch(0.85_0.12_80)] mb-1 font-sans">100%</div>
                <div className="text-xs text-slate-200 font-semibold">Source Code Ownership</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Full IP assignment upon sign-off</div>
              </div>

              <div className="p-4 rounded-2xl bg-[oklch(0.30_0.04_165/0.8)] border border-white/10 shadow-sm backdrop-blur-md">
                <div className="text-xl sm:text-2xl font-bold text-white mb-1 font-sans">MySQL 8+</div>
                <div className="text-xs text-slate-200 font-semibold">Standard Relational Core</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Direct query and audit freedom</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl sm:rounded-3xl bg-[oklch(0.30_0.045_165/0.8)] border border-white/15 p-5 sm:p-8 shadow-2xl relative space-y-5 text-left backdrop-blur-md">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-sans">
                Company Standards & Credentials
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center text-[oklch(0.85_0.12_80)] shrink-0 mt-0.5">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Registered Entity</span>
                    <span className="text-xs text-slate-300">SaaSLink Technologies Ltd (Incorporated in Kenya)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center text-[oklch(0.85_0.12_80)] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Engineering Headquarters</span>
                    <span className="text-xs text-slate-300">{address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center text-[oklch(0.85_0.12_80)] shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Statutory & Tax Compliance</span>
                    <span className="text-xs text-slate-300">PIN: {taxId} | Official Invoicing & eTIMS Compliant</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center text-[oklch(0.85_0.12_80)] shrink-0 mt-0.5">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Enterprise SLA Guarantee</span>
                    <span className="text-xs text-slate-300">24/7 Monitoring with 30-minute critical incident resolution SLA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Leadership Team (1 col mobile, 2 cols tablet, 3 cols desktop) */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
              Principal Engineering Leadership
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              Direct technical access to senior practitioners throughout your project lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeTeam.map((member) => (
              <div
                key={member.id}
                className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[oklch(0.30_0.04_165/0.8)] border border-white/10 hover:border-[oklch(0.78_0.12_78/0.4)] transition-all duration-300 text-left flex items-start gap-4 backdrop-blur-md"
              >
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-white/20 shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="space-y-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-white truncate font-sans">
                    {member.name}
                  </h4>
                  <p className="text-xs text-[oklch(0.85_0.12_80)] font-semibold truncate">
                    {member.position}
                  </p>
                  <p className="text-xs text-slate-300 pt-0.5 line-clamp-2 font-normal">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
