import React, { useState } from 'react';
import { 
  Briefcase, MapPin, Clock, ArrowRight, 
  CheckCircle2, ChevronRight, X, Send, Sparkles, Heart 
} from 'lucide-react';
import { JobOpening } from '../../types.ts';
import { CAREERS_OPENINGS } from '../../data/nexusData.ts';

interface CareersPageProps {
  onNavigateSection: (page: string) => void;
}

const PERKS = [
  'Senior mentorship on every project',
  'Health cover for you and your family',
  'Learning budget and conference sponsorship ($1,500/yr)',
  'Hybrid working — Westlands Nairobi HQ with remote days',
  'Quarterly team retreats across East Africa',
  'Real ownership over the platforms you ship — zero red tape',
];

export const CareersPage: React.FC<CareersPageProps> = ({ onNavigateSection }) => {
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyJob, setApplyJob] = useState<JobOpening | null>(null);

  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantLinks, setApplicantLinks] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleOpenApply = (job: JobOpening) => {
    setApplyJob(job);
    setApplicantName('');
    setApplicantEmail('');
    setApplicantPhone('');
    setApplicantLinks('');
    setApplicantNote('');
    setSubmitted(false);
    setApplyModalOpen(true);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.32_0.04_165)] text-slate-100">
      
      {/* Breadcrumb & Hero Header */}
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
            <span className="text-gold font-semibold">Careers</span>
          </nav>

          <div className="max-w-3xl">
            <p className="eyebrow mb-3">Careers</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
              Build software that <span className="text-gradient-gold">changes an industry</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
              Join a senior team of engineers, designers, and strategists shipping software into the sectors that matter most in East Africa.
            </p>
          </div>
        </div>
      </div>

      {/* Why SaaSLink Culture & Benefits */}
      <section className="container-x py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Why SaaSLink
        </h2>
        <p className="text-sm text-slate-400 mb-8">
          We treat engineers like partners in craft. We give you autonomy, tough problems, and senior colleagues to learn from.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PERKS.map((perk, pIdx) => (
            <div 
              key={pIdx}
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[oklch(0.36_0.045_165/0.6)] p-5 text-sm text-slate-200 backdrop-blur-sm"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[oklch(0.78_0.12_78)] mt-0.5" />
              <span>{perk}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section className="container-x pb-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Open Positions
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Currently accepting applications for our Nairobi studio and remote-friendly roles.
            </p>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full bg-[oklch(0.78_0.12_78/0.15)] text-[oklch(0.85_0.12_80)] font-semibold border border-[oklch(0.78_0.12_78/0.3)]">
            {CAREERS_OPENINGS.length} Available Roles
          </span>
        </div>

        <div className="divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/10 bg-[oklch(0.36_0.045_165/0.6)] backdrop-blur-sm">
          {CAREERS_OPENINGS.map((job) => (
            <article 
              key={job.id}
              className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.03] transition-colors"
            >
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                    {job.team}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gold" />
                    {job.location}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gold" />
                    {job.type}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {job.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setSelectedJob(job)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white rounded-lg border border-white/15 hover:bg-white/5 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleOpenApply(job)}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] px-5 py-2.5 text-xs font-semibold text-[oklch(0.22_0.03_165)] shadow-gold transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-up">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[oklch(0.78_0.12_78/0.4)] bg-[oklch(0.34_0.045_165)] p-6 sm:p-8 shadow-2xl text-slate-100">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="eyebrow text-xs">{selectedJob.team} · {selectedJob.location}</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              {selectedJob.title}
            </h3>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              {selectedJob.description}
            </p>

            <div className="mt-6">
              <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2">
                What We Are Looking For
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                {selectedJob.requirements.map((req, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[oklch(0.78_0.12_78)] mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2">
                What You Receive
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                {selectedJob.benefits.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2.5">
                    <Sparkles className="h-4 w-4 shrink-0 text-[oklch(0.78_0.12_78)] mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-5 py-2.5 text-sm text-slate-300 hover:text-white rounded-lg border border-white/10"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const jobToApply = selectedJob;
                  setSelectedJob(null);
                  handleOpenApply(jobToApply);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] px-6 py-2.5 text-sm font-semibold text-[oklch(0.22_0.03_165)] shadow-gold"
              >
                <span>Apply for this Role</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Submission Modal */}
      {applyModalOpen && applyJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-up">
          <div className="relative w-full max-w-lg rounded-3xl border border-[oklch(0.78_0.12_78/0.4)] bg-[oklch(0.34_0.045_165)] p-6 sm:p-8 shadow-2xl text-slate-100">
            <button
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Application Received!</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Thank you, {applicantName}. Our engineering hiring panel reviews every application thoroughly. You will hear from us within 3 business days.
                </p>
                <button
                  onClick={() => setApplyModalOpen(false)}
                  className="mt-6 px-6 py-2.5 text-sm font-semibold rounded-lg bg-[oklch(0.78_0.12_78)] text-[oklch(0.22_0.03_165)]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit}>
                <p className="eyebrow text-xs">Application</p>
                <h3 className="text-xl font-bold text-white mt-1">
                  Apply for {applyJob.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {applyJob.team} · {applyJob.location}
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Dennis Kiprop"
                      className="w-full rounded-xl border border-white/15 bg-black/25 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full rounded-xl border border-white/15 bg-black/25 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="+254 700 ..."
                        className="w-full rounded-xl border border-white/15 bg-black/25 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      GitHub / LinkedIn / Portfolio URL
                    </label>
                    <input
                      type="url"
                      value={applicantLinks}
                      onChange={(e) => setApplicantLinks(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full rounded-xl border border-white/15 bg-black/25 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Brief Note / Relevant Experience
                    </label>
                    <textarea
                      rows={3}
                      value={applicantNote}
                      onChange={(e) => setApplicantNote(e.target.value)}
                      placeholder="Tell us what you built recently or why this role excites you..."
                      className="w-full rounded-xl border border-white/15 bg-black/25 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] px-6 py-2.5 text-xs font-semibold text-[oklch(0.22_0.03_165)] shadow-gold"
                  >
                    <span>Submit Application</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Shared CTA Banner */}
      <section className="container-x py-16">
        <div className="relative overflow-hidden rounded-3xl border border-[oklch(0.78_0.12_78/0.3)] bg-gradient-to-br from-[oklch(0.34_0.05_165)] to-[oklch(0.26_0.04_165)] p-10 sm:p-14 shadow-elegant">
          <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="eyebrow mb-3">Don&apos;t see your role?</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                We always make room for exceptional engineers.
              </h2>
              <p className="mt-4 max-w-xl text-slate-300 text-base leading-relaxed">
                If you write clean code, care about system architecture, and want to ship platforms across Africa, send your resume to our engineering leads directly.
              </p>
            </div>
            <div className="flex md:justify-end">
              <a
                href="mailto:careers@saaslink.tech"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[oklch(0.82_0.12_82)] to-[oklch(0.72_0.13_70)] px-6 py-4 font-semibold text-[oklch(0.22_0.03_165)] shadow-gold transition-transform hover:-translate-y-0.5 text-sm"
              >
                <span>Email careers@saaslink.tech</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
