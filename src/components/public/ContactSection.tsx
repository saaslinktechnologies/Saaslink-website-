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
    serviceOfInterest: initialService,
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
    <section id="contact" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          
          {/* Left Column: Direct Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400">
                <span>Start a Project</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                Let's discuss your enterprise system
              </h2>
              <p className="text-slate-400 text-base">
                Whether you need a full enterprise software suite, a custom platform deployment, or database architectural consultation, our team will provide clear scope and pricing.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Direct Telephone & WhatsApp</span>
                  <a href={`tel:${settings?.companyPhone || settings?.phone || '+254 720 000 000'}`} className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors">
                    {settings?.companyPhone || settings?.phone || '+254 720 000 000 / +254 733 000 000'}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Official Inquiry Email</span>
                  <a href={`mailto:${settings?.companyEmail || settings?.email || 'contact@saaslink.tech'}`} className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors">
                    {settings?.companyEmail || settings?.email || 'contact@saaslink.tech'}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Engineering Headquarters</span>
                  <p className="text-xs text-slate-300">
                    {settings?.companyAddress || settings?.address || 'Delta Corner Tower, Westlands, Nairobi, Kenya'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Working Hours</span>
                  <p className="text-xs text-slate-300">
                    Monday – Friday: 8:00 AM – 6:00 PM EAT (SLA 24/7 Monitoring)
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy & Guarantee */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 flex items-center gap-3 text-xs text-slate-300">
              <Shield className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>We sign Non-Disclosure Agreements (NDAs) prior to detailed architecture reviews upon request.</span>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 sm:p-10 shadow-2xl">
              
              <h3 className="text-xl font-display font-bold text-white mb-2">
                Send Project Requirements
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Receive a detailed technical feasibility review and preliminary quote proposal within 24 business hours.
              </p>

              {successMessage && (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-sm flex items-start gap-3 mb-6">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-sm flex items-start gap-3 mb-6">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="david@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Healthcare Ltd"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
                    >
                      <option value="">Select Service...</option>
                      {(services || []).map((s) => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                      <option value="PropLink ERP Demo">PropLink ERP Demo</option>
                      <option value="EduLink 360 Demo">EduLink 360 Demo</option>
                      <option value="MySQL Architecture & Migration">MySQL Architecture & Migration</option>
                      <option value="General Enterprise Inquiry">General Enterprise Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Estimated Budget Range
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400"
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
                    placeholder="Describe your current bottlenecks, target users, desired integrations (e.g., MPesa, MySQL, ERP), and key outcomes..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting to Engineering Team...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry & Request Technical Review</span>
                      <Send className="w-4 h-4" />
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
