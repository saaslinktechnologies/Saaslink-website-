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
    <section id="about" className="py-24 bg-slate-900/30 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Company Identity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400">
              <span>Corporate Overview</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Engineering sustainable autonomy for African enterprises
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              Founded on the belief that mission-critical businesses deserve bespoke, robust software systems without debilitating foreign license lock-ins, <strong>SaaSLink Technologies Ltd</strong> designs, architects, and maintains enterprise-grade applications.
            </p>

            <p className="text-slate-400 text-sm leading-relaxed">
              Headquartered along Ngong Road in Nairobi, Kenya, our senior engineering guild serves regional logistics hubs, healthcare providers, educational trusts, and multi-tenant property portfolios across East Africa and international jurisdictions.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-2xl font-display font-bold text-cyan-400 mb-1">100%</div>
                <div className="text-xs text-slate-300 font-medium">Source Code Ownership</div>
                <div className="text-[11px] text-slate-500 mt-1">Full IP assignment upon sign-off</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-2xl font-display font-bold text-blue-400 mb-1">MySQL 8+</div>
                <div className="text-xs text-slate-300 font-medium">Standard Relational Core</div>
                <div className="text-[11px] text-slate-500 mt-1">Direct query and audit freedom</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-slate-950 border border-slate-800 p-8 shadow-2xl relative space-y-6 text-left">
              <h3 className="text-xl font-display font-bold text-white mb-2">
                Company Standards & Credentials
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Registered Entity</span>
                    <span className="text-xs text-slate-400">SaaSLink Technologies Ltd (Incorporated in Kenya)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Engineering Headquarters</span>
                    <span className="text-xs text-slate-400">{address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Statutory & Tax Compliance</span>
                    <span className="text-xs text-slate-400">PIN: {taxId} | Official Invoicing Compliant</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Global SLA Guarantee</span>
                    <span className="text-xs text-slate-400">24/7 Monitoring with 30-minute critical incident resolution SLA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Leadership Team */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-display font-bold text-white">
              Principal Engineering Leadership
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Direct technical access to senior practitioners throughout your project lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeTeam.map((member) => (
              <div
                key={member.id}
                className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 text-left flex items-start gap-4"
              >
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-cyan-500/30 shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="space-y-1">
                  <h4 className="text-base font-display font-bold text-white">
                    {member.name}
                  </h4>
                  <p className="text-xs text-cyan-400 font-medium">
                    {member.position}
                  </p>
                  <p className="text-xs text-slate-400 pt-1 line-clamp-2">
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
