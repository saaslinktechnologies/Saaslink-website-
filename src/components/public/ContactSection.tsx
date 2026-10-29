import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Send, CheckCircle2, 
  Clock, Shield, ArrowRight, AlertCircle 
} from 'lucide-react';
import { GlobalSettings, Service } from '../../types.ts';

interface ContactSectionProps {
  settings?: GlobalSettings;
  services?: Service[];
  initialService?: string;
  onOpenQuotePlanner?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  services = [],
  initialService = '',
  onOpenQuotePlanner,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    serviceOfInterest: initialService || 'PropCloud360 Property Management',
    budgetRange: 'KSh 500,000 - 1,500,000 ($4k - $12k)',
    timeline: '1 - 3 Months',
    message: '',
    type: 'contact',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setSuccessMessage(data.message);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        serviceOfInterest: '',
        budgetRange: 'KSh 500,000 - 1,500,000 ($4k - $12k)',
        timeline: '1 - 3 Months',
        message: '',
        type: 'contact',
      });
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[oklch(0.24_0.035_165)] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 text-left items-start">
          
          {/* Left Column: Direct Contact Details (auto-resizes to 2-col cards on tablet) */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="space-y-2.5 sm:space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] text-xs font-semibold text-[oklch(0.85_0.12_80)]">
                <span>Start an Enterprise Engagement</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight leading-tight">
                Let&apos;s discuss your enterprise system
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                Whether you need a full enterprise software suite, a custom platform deployment, or database architectural consultation, our lead engineering team will provide unambiguous scope and pricing.
              </p>
            </div>

            {/* Direct Contact Cards (2 cols on tablet, 1 on mobile & desktop sidebar) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
              <div className="p-4 rounded-2xl bg-[oklch(0.30_0.04_165/0.8)] border border-white/10 flex items-start gap-3.5 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center text-[oklch(0.85_0.12_80)] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-slate-400 block font-medium">Direct Telephone & WhatsApp</span>
                  <a href={`tel:${settings?.companyPhone || settings?.phone || '+254 720 000 000'}`} className="text-xs sm:text-sm font-semibold text-white hover:text-[oklch(0.85_0.12_80)] transition-colors truncate block">
                    {settings?.companyPhone || settings?.phone || '+254 720 000 000 / +254 733 000 000'}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[oklch(0.30_0.04_165/0.8)] border border-white/10 flex items-start gap-3.5 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center text-[oklch(0.85_0.12_80)] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-slate-400 block font-medium">Official Inquiry Email</span>
                  <a href={`mailto:${settings?.companyEmail || settings?.email || 'contact@saaslink.tech'}`} className="text-xs sm:text-sm font-semibold text-white hover:text-[oklch(0.85_0.12_80)] transition-colors truncate block">
                    {settings?.companyEmail || settings?.email || 'contact@saaslink.tech'}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[oklch(0.30_0.04_165/0.8)] border border-white/10 flex items-start gap-3.5 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center text-[oklch(0.85_0.12_80)] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-slate-400 block font-medium">Engineering Headquarters</span>
                  <p className="text-xs text-slate-300">
                    {settings?.companyAddress || settings?.address || 'Delta Corner Tower, Westlands, Nairobi, Kenya'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[oklch(0.30_0.04_165/0.8)] border border-white/10 flex items-start gap-3.5 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-[oklch(0.78_0.12_78/0.15)] border border-[oklch(0.78_0.12_78/0.3)] flex items-center justify-center text-[oklch(0.85_0.12_80)] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-slate-400 block font-medium">Working Hours</span>
                  <p className="text-xs text-slate-300">
                    Monday – Friday: 8:00 AM – 6:00 PM EAT (SLA 24/7 Monitoring)
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy & Guarantee */}
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex items-center gap-3 text-xs text-slate-300">
              <Shield className="w-5 h-5 text-[oklch(0.85_0.12_80)] shrink-0" />
              <span>We sign Non-Disclosure Agreements (NDAs) prior to detailed architecture reviews upon request.</span>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-7 w-full">
            <div className="rounded-2xl sm:rounded-3xl bg-[oklch(0.30_0.045_165/0.8)] border border-white/15 p-5 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-md">
              
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 font-sans">
                Send Project Requirements
              </h3>
              <p className="text-xs text-slate-300 mb-6">
                Receive a detailed technical feasibility review and preliminary quote proposal within 24 business hours.
              </p>

              {successMessage && (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-sm flex items-start gap-3 mb-6">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-sm flex items-start gap-3 mb-6">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Mwangi"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[oklch(0.85_0.12_80)] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="david@company.co.ke"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[oklch(0.85_0.12_80)] min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+254 7XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[oklch(0.85_0.12_80)] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Enterprises Ltd"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[oklch(0.85_0.12_80)] min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Service / Platform of Interest
                    </label>
                    <select
                      value={formData.serviceOfInterest}
                      onChange={(e) => setFormData({ ...formData, serviceOfInterest: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[oklch(0.85_0.12_80)] min-h-[44px] cursor-pointer"
                    >
                      <option value="">Select Platform...</option>
                      <option value="PropCloud360 Property Management">PropCloud360 Property Management</option>
                      <option value="Pijo Shop Footwear POS (app.pijo.shop)">Pijo Shop Footwear POS (app.pijo.shop)</option>
                      <option value="MASUMA ERP Multi-Branch & eTIMS">MASUMA ERP Multi-Branch & eTIMS</option>
                      <option value="RaphaMIS Hospital Core & SHA">RaphaMIS Hospital Core & SHA</option>
                      <option value="Aura Utility Smart Water Metering">Aura Utility Smart Water Metering</option>
                      <option value="EMIS CBC School & Fee System">EMIS CBC School & Fee System</option>
                      <option value="Ecclesiah Church & Diocese System">Ecclesiah Church & Diocese System</option>
                      <option value="Haki Hali Civic Transparency">Haki Hali Civic Transparency</option>
                      <option value="Custom Enterprise Architecture">Custom Enterprise Architecture</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Estimated Budget Range
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[oklch(0.85_0.12_80)] min-h-[44px] cursor-pointer"
                    >
                      <option value="Below KSh 500,000 (< $4,000)">Below KSh 500,000 (&lt; $4k)</option>
                      <option value="KSh 500,000 - 1,500,000 ($4k - $12k)">KSh 500,000 - 1,500,000 ($4k - $12k)</option>
                      <option value="KSh 1,500,000 - 4,000,000 ($12k - $30k)">KSh 1,500,000 - 4,000,000 ($12k - $30k)</option>
                      <option value="Above KSh 4,000,000 (> $30,000)">Above KSh 4,000,000 (&gt; $30k+)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Deployment Timeline
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[oklch(0.85_0.12_80)] min-h-[44px] cursor-pointer"
                  >
                    <option value="Urgent (< 30 Days)">Urgent (&lt; 30 Days)</option>
                    <option value="1 - 3 Months">1 - 3 Months</option>
                    <option value="3 - 6 Months">3 - 6 Months</option>
                    <option value="Planning & Exploration">Planning & Exploration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Project Scope & Key Requirements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your current bottlenecks, target users, desired integrations (e.g., M-Pesa, KRA eTIMS, MySQL), and key deliverables..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[oklch(0.85_0.12_80)] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] text-[oklch(0.22_0.03_165)] font-bold text-xs sm:text-sm shadow-gold transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
                >
                  {loading ? (
                    <span>Submitting to Engineering Team...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry & Request Technical Review</span>
                      <Send className="w-4 h-4 shrink-0" />
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
