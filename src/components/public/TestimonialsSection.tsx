import React from 'react';
import { Star, Quote, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Testimonial } from '../../types.ts';

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials = [],
}) => {
  const safeTestimonials = testimonials || [];

  return (
    <section className="py-24 bg-[oklch(0.28_0.038_165)] border-t border-white/10">
      <div className="container-x">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <p className="eyebrow">Tested by Demanding Teams</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            Trusted by Leaders Who <span className="text-gradient-gold">Cannot Afford System Failures</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            From regional financial cooperatives and healthcare networks to rapidly scaling SaaS founders, engineering teams rely on our software to run their daily revenue operations.
          </p>
        </div>

        {/* Featured Pull Quote Block: Amina Yusuf (CTO, Baraka SACCO) */}
        <div className="mb-14 p-8 sm:p-12 rounded-3xl border border-[oklch(0.78_0.12_78/0.4)] bg-gradient-to-br from-[oklch(0.36_0.045_165)] to-[oklch(0.26_0.04_165)] shadow-elegant relative overflow-hidden backdrop-blur-md">
          <Quote className="absolute right-8 top-8 w-16 h-16 text-white/5 pointer-events-none" />
          
          <div className="max-w-3xl">
            <div className="flex items-center gap-1 mb-4 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="ml-2 text-xs font-mono text-slate-300 font-semibold">Verified Enterprise Deploy</span>
            </div>

            <blockquote className="text-lg sm:text-2xl text-white font-medium leading-relaxed italic">
              &quot;SaaSLink felt less like an outsourced agency and more like our own staff engineering division. They don&apos;t just take tickets; they challenge bad architectural assumptions, propose cleaner data models, and deliver production systems that operate quietly under heavy load. Migrating 14 legacy services to the cloud with zero downtime was a masterclass in execution.&quot;
            </blockquote>

            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-base font-bold text-white">Amina Yusuf</p>
                <p className="text-xs text-[oklch(0.78_0.12_78)] font-semibold">
                  Chief Technology Officer, Baraka SACCO
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                14 Services Migrated · Zero Downtime
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-2xl bg-[oklch(0.36_0.045_165/0.65)] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between backdrop-blur-sm">
            <div>
              <div className="flex gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic mb-4">
                &quot;We cut our invoice dispute rate by 78% within 90 days of deploying their billing engine. Their code quality and documentation are exemplary.&quot;
              </p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs font-bold text-white">Wanjiru Kariuki</p>
              <p className="text-[11px] text-slate-400">CFO, Meridian Utilities</p>
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-[oklch(0.36_0.045_165/0.65)] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between backdrop-blur-sm">
            <div>
              <div className="flex gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic mb-4">
                &quot;Weekly demos, transparent Linear boards, and a software architecture that passed our SOC 2 and KDPA data compliance audits on the first pass.&quot;
              </p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs font-bold text-white">David Otieno</p>
              <p className="text-[11px] text-slate-400">Head of Product, Nyota Health</p>
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-[oklch(0.36_0.045_165/0.65)] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between backdrop-blur-sm">
            <div>
              <div className="flex gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic mb-4">
                &quot;Their telematics and route dispatch platform saved us 23% in fleet fuel costs. Senior engineers who truly understand African connectivity realities.&quot;
              </p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs font-bold text-white">Peter Mwangi</p>
              <p className="text-[11px] text-slate-400">COO, Rift Valley Logistics</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
